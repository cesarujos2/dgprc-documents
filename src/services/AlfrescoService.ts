import axios, { AxiosInstance, isAxiosError } from "axios";
import { appsettings } from "../config/appsetting";

export class AlfrescoService {
    private static instance: AlfrescoService;
    private axiosInstance: AxiosInstance;
    private token?: string = "dfs";

    private constructor(baseUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    public static getInstance(): AlfrescoService {
        if (!AlfrescoService.instance) {
            AlfrescoService.instance = new AlfrescoService(appsettings.alfresco.URL);
        }
        return AlfrescoService.instance;
    }

    private async GetToken(force: boolean = false): Promise<string> {
        try {
            if (!force && this.token) return this.token;
            const result = await this.axiosInstance.post('/alfresco/service/api/login', {
                username: appsettings.alfresco.userName,
                password: appsettings.alfresco.password
            });
            this.token = result.data.data.ticket;
            return result.data.data.ticket
        } catch (error: any) {
            throw new Error("Error obteniendo el token de Alfresco" + error.message);
        }
    }

    public async GetDocumentUrl(nameFile: string): Promise<string | null> {
        try {
            if (!nameFile || nameFile === "") return null;
            const token = await this.GetToken();
            const result = await this.axiosInstance.get(`/alfresco/api/-default-/public/alfresco/versions/1/queries/nodes/`, {
                params: {
                    term: nameFile,
                    rootNodeId: appsettings.alfresco.rootNodeId,
                    nodeType: "cm:content",
                    alf_ticket: token
                }
            });

            const entries = result.data.list.entries;
            if (!entries || entries.length === 0) throw new Error("ERROR: No se encontró documento en Alfresco");
            return appsettings.alfresco.visorSTD + entries[0].entry.id;
        } catch (error: any) {
            if (isAxiosError(error)) {
                if (error.status === 401) {
                    this.token = undefined;
                    return await this.GetDocumentUrl(nameFile);
                }
            }
            throw new Error("Error obteniendo el documento de Alfresco" + error.message);
        }
    }

}