import { createClientAsync } from "soap";
import { Anexo, ConsultaExpedienteRequest, DownloadAnexoWSRequest, Expediente, ObtenerAnexoRequest, SoapResponse, STDClient } from "../interfaces/IStd";
import { appsettings } from "../config/appsetting";

export class StdService {
    private static instance: StdService;
    private client: STDClient | null = null;
    private clientInitializationPromise: Promise<void> | null = null;

    private constructor() { }

    public static getInstance(): StdService {
        if (!StdService.instance) {
            StdService.instance = new StdService();
        }
        return StdService.instance;
    }

    private async initializeClient(): Promise<void> {
        if (!this.clientInitializationPromise) {
            this.clientInitializationPromise = (async () => {
                try {
                    this.client = await createClientAsync(appsettings.std.URL) as STDClient;
                    console.log('Cliente SOAP creado con éxito.');
                } catch (err: any) {
                    this.clientInitializationPromise = null;
                    throw new Error('Error al crear el cliente SOAP.' + err.message);
                }
            })();
        }
        await this.clientInitializationPromise;
    }

    private async ensureClientInitialized(): Promise<void> {
        if (!this.client) {
            await this.initializeClient();
        }
    }

    private async callSoapMethod<T>(methodName: keyof STDClient, args: any): Promise<T> {
        await this.ensureClientInitialized();
        return new Promise<T>((resolve, reject) => {
            this.client?.[methodName](args, (err: any, result: T) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    public async getDocumentByRoadMap(args: ConsultaExpedienteRequest): Promise<Expediente> {
        try {
            const result = await this.callSoapMethod<SoapResponse<Expediente | Expediente[]>>('consultaExpediente', args);
            if (Array.isArray(result.URL)) {
                return result.URL.find(x => x.noexpediente.split('-')[0] == 'E') ?? result.URL[0]
            }
            return result.URL;
        } catch (err: any) {
            throw new Error('Error al invocar el método consultaExpediente: ' + err.message);
        }
    }

    public async getListAnnex(args: ObtenerAnexoRequest): Promise<Anexo[]> {
        try {
            const result = await this.callSoapMethod<SoapResponse<Anexo[]>>('obtenerAnexo', args);
            return result.URL;
        } catch (err: any) {
            throw new Error('Error al invocar el método obtenerAnexo: ' + err.message);
        }
    }

    public async downloadAnnex(args: DownloadAnexoWSRequest): Promise<ArrayBuffer> {
        try {
            const result = await this.callSoapMethod<SoapResponse<string>>('downloadAnexoWS', args);
            const pdfBuffer = Buffer.from(result.URL, 'base64');
            return pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength);
        } catch (err: any) {
            throw new Error('Error al invocar el método downloadAnexoWS: ' + err.message);
        }
    }
}
