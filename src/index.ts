import { getDocumentsFTA } from "./features/getDocumentsFTA";
import { AlfrescoService } from "./services/AlfrescoService";
import DatabaseService from "./services/DatabaseService";
import { TefiService } from "./services/TefiService";

const tefiService = TefiService.getInstance();
const databaseService = DatabaseService.getInstance();
const alfrescoService = AlfrescoService.getInstance();


async function main() {
    try {
        const roadmaps = databaseService.getDocuments().map(doc => doc.roadmap);
        const tefiDocs = await tefiService.GetFitac(roadmaps);

        for (const item of tefiDocs) {
            try {
                databaseService.saveDocument(item);
            } catch (err: any) {
                console.error('Error al guardar documento en DB:', item.roadmap, err.message);
            }
        }

        const dbDocs = databaseService.getDocuments();
        if (dbDocs.length > 0) {
            for (const item of dbDocs) {
                if (item.officeId) continue;
                try {
                    const stdData = await getDocumentsFTA(item.roadmap);
                    if (!stdData.office && !stdData.report) continue;
                    if (stdData.office) {
                        item.deleted = 1;
                    };

                    item.officeId = stdData.office?.id;
                    item.officeName = stdData.office?.name;
                    item.officeFileName = stdData.office?.fileName;
                    item.officeDate = stdData.office?.date;
                    item.officeUrl = await alfrescoService.GetDocumentUrl(stdData.office?.fileName);

                    item.reportId = stdData.report?.id;
                    item.reportName = stdData.report?.name;
                    item.reportFileName = stdData.report?.fileName;
                    item.reportDate = stdData.report?.date;
                    item.reportUrl = await alfrescoService.GetDocumentUrl(stdData.report?.fileName);

                    await tefiService.SetDocumentFitac(item);
                    databaseService.updateDocument(item);
                } catch (err: any) {
                    console.error('Error al obtener documentos del STD:' + item.roadmap + ' ' + err.message);
                }
            }
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

main();
// setInterval(main, 3600000);
