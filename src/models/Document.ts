export interface Document {
    id: number;
    roadmap: string;
    tefiId: string;

    officeId: number | null;
    officeName: string | null;
    officeFileName: string | null;
    officeUrl: string | null;
    officeDate: string | null;

    reportId: number | null;
    reportName: string | null;
    reportFileName: string | null;
    reportUrl: string | null;
    reportDate: string | null;

    deleted: number;
    creationDate: Date;
}