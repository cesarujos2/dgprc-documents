import { Client } from "soap";

//export interfaces del Servicio SOAP del STD
export interface STDClient extends Client {
    consultaExpediente: SoapMethod<ConsultaExpedienteRequest, SoapResponse<Expediente | Expediente[] >>
    obtenerAnexo: SoapMethod<ObtenerAnexoRequest, SoapResponse<Anexo[] | Anexo>>
    downloadAnexoWS: SoapMethod<DownloadAnexoWSRequest, SoapResponse<string>>
}

//export interfaces de los metodos del Servicio SOAP del STD
export interface SoapMethod<TRequest, TResponse> {
    (args: TRequest, callback: (err: any, result: TResponse) => void): void;
}


//export interfaces de las consultas del Servicio SOAP del STD
export interface ConsultaExpedienteRequest {
    anio: string;
    numero: string;
}

export interface ObtenerAnexoRequest {
    nroHojaRuta: string;
}

export interface DownloadAnexoWSRequest {
    idAnexo: string;
}

//Interfaz principal de la respuesta del servicio SOAP del STD
export interface SoapResponse<TResponse>{
    URL: TResponse
}

//Interfaz de la respuesta de la consulta de expediente
export interface Expediente {
    anexos: string;
    asunto: string;
    cadenasPrueba: string;
    claveAdministrado: string;
    courier: Courier[];
    departamento: string;
    derivExterna: string;
    diasMaxEstadia: string;
    direccion: string;
    distrito: string;
    fechahoradeiniciodetramite: string;
    fechahoradeldocumento: string;
    fechahorarecepcion: string;
    iddoc: string;
    instruccion: string;
    movimientos: Movimientos[];
    noexpediente: string;
    numerodedocumento: string;
    numerodefolios: string;
    observacionDocFin: string;
    ordenVuce: string;
    pais: string;
    prioridad: string;
    procedimiento: string;
    provincia: string;
    remitente: string;
    responsableArea: string;
    responsableUsuario: string;
    situacionactual: string;
    tipodedocumento: string;
    tupa: string;
}

export interface Movimientos {
    apellidoMaternoDestino: string;
    apellidoPaternoDestino: string;
    estado: string;
    fechadederivacion: string;
    fechadeestado: string;
    instruccion: string;
    instruccionList: string[];
    nombreDestino: string;
    observacion: string;
    observacionAtencion: string;
    perfil: string;
    remitente: string;
    tiempotranscurrido: string;
    unidaddestino: string;
    usuarioDestino: string;
}

export interface Courier {
    direcciontxt: string;
    doAnio: string;
    doDesc: string;
    doId: string;
    doNodoc: string;
    doNohe: string;
    doNohetxt: string;
    doNoordenpedido: string;
    estadotxt: string;
    fechaCrea: string;
}

export interface Anexo {
    fechaCrea: Date;
    filename: string;
    filenameoriginal: string;
    filenameoriginalV2: string;
    flagDigital: string;
    idAnexo: number;
    idDoc: string;
    nroDoc: string;
    nuevoArchivo: string;
    remitente: string;
    tipoDoc: string;
}
