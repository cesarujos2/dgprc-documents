import { Anexo } from "../interfaces/IStd";
import { IAttached } from "../interfaces/IAttached";
import { StdService } from "../services/StdService";

const std = StdService.getInstance();

const mapDocument = (doc: Anexo): IAttached => ({
    id: doc.idAnexo,
    name: doc.filenameoriginal.replace(".pdf", "").replace(/_(INFORME|OFICIO)/gi, ""),
    fileName: doc.filename,
    date: doc.fechaCrea.toISOString().slice(0, 10),
});

export const getDocumentsFTA = async (roadmap: string) => {
    const response = await std.getListAnnex({ nroHojaRuta: roadmap });

    const regex = /^\d+-\d{4}-MTC\/26(\.01)?_(INFORME|OFICIO)\.pdf$/;

    const filterDocsByType = (type: 'OFICIO' | 'INFORME') => {
        return response
            .filter(doc => regex.test(doc.filenameoriginal) && doc.filenameoriginal.includes(type))
            .map(doc => mapDocument(doc));
    };

    const reportDocs = filterDocsByType('INFORME');
    const officeDocs = reportDocs.length === 0 ? [] : filterDocsByType('OFICIO').filter(doc => new Date(doc.date) >= new Date(reportDocs[0].date));

    return { office: officeDocs[0] ?? null, report: reportDocs[0] ?? null };
};
