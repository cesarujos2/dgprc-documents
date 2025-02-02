import { IFtaTefi, ITefi } from "../interfaces/ITefi";
import { Document } from "../models/Document";



export type TefiData<T> = {
    [key in keyof T]: any;
};

export function TefiAdapter<T>(data: ITefi<T>): TefiData<T>[] {
    const adaptedDataArray: TefiData<T>[] = [];

    if (data.entry_list.length === 0) return adaptedDataArray;

    for (const entry of data.entry_list) {
        const valueList = entry.name_value_list;
        const dataAdapted: TefiData<T> = {} as TefiData<T>;

        for (const item of Object.keys(valueList) as (keyof typeof valueList)[]) {
            dataAdapted[item] = valueList[item].value.trim();
        }

        adaptedDataArray.push(dataAdapted);
    }

    return adaptedDataArray;
}

export function FtaAdapter(data: TefiData<IFtaTefi>[]): Document[] {
    return data.filter(x => x.document_name.length == 13).map((item) => {
        return {
            tefiId: item.id,
            roadmap: item.document_name,
            officeName: item.nro_oficio_rep_c,
            officeDate: item.fecha_oficio_c,
            officeUrl: item.link_oficio_c == 'http://' ? null : item.link_oficio_c,

            reportName: item.nro_informe_rep_c,
            reportDate: item.fecha_informe_rep_c,
            reportUrl: item.link_informe_rep_c == 'http://' ? null : item.link_informe_rep_c,

        } as Document
    });
}


