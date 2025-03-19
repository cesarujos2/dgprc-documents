import { getDocumentsFTA } from "./features/getDocumentsFTA";
import { AlfrescoService } from "./services/AlfrescoService";
import DatabaseService from "./services/DatabaseService";
import { TefiService } from "./services/TefiService";

const tefiService = TefiService.getInstance();
const databaseService = DatabaseService.getInstance();
const alfrescoService = AlfrescoService.getInstance();

console.log(`\nIniciando proceso de sincronización de documentos de Tefi ${new Date().toLocaleTimeString()}\n`);

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

        console.log("Actualizado a las " + new Date().toLocaleTimeString())
    } catch (err) {
        console.error('Error:', err);
    }
}

const schedule = ["08:30", "12:00", "18:00", "20:00"];

function getCurrentTimeInMinutesUTC5(): number {
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const localMinutes = utcMinutes - 5 * 60;
    return (localMinutes + 24 * 60) % (24 * 60);
}

async function startLoop() {
    await main();
    while (true) {
        const currentTime = getCurrentTimeInMinutesUTC5();

        let nextExecution = schedule
            .map(time => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours * 60 + minutes;
            })
            .find(time => time > currentTime);

        if (nextExecution === undefined) {
            nextExecution = schedule
                .map(time => {
                    const [hours, minutes] = time.split(":").map(Number);
                    return hours * 60 + minutes;
                })[0];
            nextExecution += 24 * 60;
        }

        const waitTimeMs = (nextExecution - currentTime) * 60000;
        const nextExecutionFormatted = schedule.find(time => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes === (nextExecution % (24 * 60));
        });

        console.log(
            `Siguiente ejecución a las ${nextExecutionFormatted} (UTC-5). Esperando ${Math.round(waitTimeMs / 60000)} minutos...`
        );

        await new Promise(resolve => setTimeout(resolve, waitTimeMs));

        await main();
    }
}

startLoop();
