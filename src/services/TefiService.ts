import { Document } from './../models/Document';
import axios, { AxiosInstance } from "axios";
import { appsettings } from "../config/appsetting";
import { FtaAdapter, TefiAdapter } from "../adapters/tefiAdapter";
import { IFtaTefi, ITefi } from "../interfaces/ITefi";

export class TefiService {
    private static instance: TefiService;
    private axiosInstance: AxiosInstance;
    private token: string = "null";

    private constructor(baseUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
    }

    public static getInstance(): TefiService {
        if (!TefiService.instance) {
            TefiService.instance = new TefiService(appsettings.tefi.URL);
        }
        return TefiService.instance;
    }

    private async Request<T>(method: string, args: any): Promise<any> {
        const postData = {
            method: method,
            input_type: 'JSON',
            response_type: 'JSON',
            rest_data: JSON.stringify(args),
        };

        const response = await this.axiosInstance.post('/service/v4_1/rest.php', postData);
        const data = response.data;
        if (data.number == 11 || data.name == 'Invalid Session ID') {
            await this.GetToken(true);
            return await this.Request(method, { ...args, session: this.token });
        }
        return data;
    }

    private async GetToken(force: boolean = false): Promise<boolean> {
        try {
            if (this.token && !force) return true
            const result = await this.Request('login', {
                'user_auth': {
                    'user_name': appsettings.tefi.userName,
                    'password': appsettings.tefi.password
                },
                'application_name': 'My SuiteCRM REST Client',
                'name_value_list': {}
            })
            this.token = result.id
            return true
        } catch (error: any) {
            throw new Error("Error obteniendo el token de Tefi" + error.message);
        }
    }

    public async GetFitac(roadmaps: string[]): Promise<Document[]> {
        try {
            let formattedList = roadmaps.filter(x => x).map(x => { if (x) { return `'${x}'` } }).join(', ');
            if (formattedList !== '') formattedList = `document_name NOT IN (${formattedList})`

            const selectedFields = ["id", "document_name", "nro_oficio_rep_c", "fecha_oficio_c", "link_oficio_c",
                "nro_informe_rep_c", "fecha_informe_rep_c", "link_informe_rep_c", "assigned_user_name"]

            const notFilteredFields = ["id", "document_name", "fecha_oficio_c", "fecha_informe_rep_c",
                "nro_informe_rep_c", "link_informe_rep_c"]

            const postData = {
                session: this.token,
                module_name: "Fitac_fitac",
                query: `${[
                    formattedList,
                    "status_id <> ''",
                    "status_id IS NOT NULL",
                    "status_id <> 'por_evaluar'",
                    "fecha_ingreso_c > '2025-01-01'",
                    "(" + selectedFields
                        .filter(a => (a && a != "" && !notFilteredFields.includes(a)))
                        .map(a => `${a} = '' OR ${a} = 'http://' OR ${a} IS NULL`)
                        .join(' OR ') + ")",
                ].filter(x => x && x != '').join(' AND ')}`,
                order_by: "date_entered DESC",
                offset: 0,
                select_fields: selectedFields,
                link_name_to_fields_array: [],
                max_results: appsettings.tefi.maxDailyFTASigned,
                deleted: 0
            }

            const result = await this.Request('get_entry_list', postData)
            let data = result as ITefi<IFtaTefi>
            if (data.result_count == 0) return []
            const tefiData = TefiAdapter(data)
            return FtaAdapter(tefiData)
        } catch (error: any) {
            throw new Error("Error obteniendo documentos de Tefi" + error.message);
        }
    }

    public async SetDocumentFitac(doc: Document) {
        try {
            const postData = {
                session: this.token,
                document_name: "Fitac_fitac",
                name_value_list: {
                    id: { name: "id", value: doc.tefiId },
                    document_name: { name: "document_name", value: doc.roadmap },
                    nro_oficio_rep_c: { name: "nro_oficio_rep_c", value: doc.officeName },
                    fecha_oficio_c: { name: "fecha_oficio_c", value: doc.officeDate },
                    link_oficio_c: { name: "link_oficio_c", value: doc.officeUrl },
                    nro_informe_rep_c: { name: "nro_informe_rep_c", value: doc.reportName },
                    fecha_informe_rep_c: { name: "fecha_informe_rep_c", value: doc.reportDate },
                    link_informe_rep_c: { name: "link_informe_rep_c", value: doc.reportUrl },
                    oficio_resol_doc_id_c: { name: "oficio_resol_doc_id_c", value: doc.officeUrl?.match(/\/([^\/]+)$/)?.[1] },
                    informe_resol_doc_id_c: { name: "informe_resol_doc_id_c", value: doc.reportUrl?.match(/\/([^\/]+)$/)?.[1] },
                }
            }
            const result = await this.Request('set_entry', postData)
            return result
        } catch (error: any) {
            throw new Error("Error al guardar documento en DB:" + doc.roadmap + error.message);
        }
    }
}

