import Database, { Database as SQLiteDatabase } from "better-sqlite3";
import { Document } from '../models/Document';

class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLiteDatabase;

  private constructor() {
    this.db = new Database("dist/database.sqlite");

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tefiId TEXT NOT NULL UNIQUE,
        roadmap TEXT NOT NULL,

        officeId INTEGER,
        officeName TEXT,
        officeFileName TEXT,
        officeUrl TEXT,
        officeDate TEXT,

        reportId INTEGER,
        reportName TEXT,
        reportFileName TEXT,
        reportUrl TEXT,
        reportDate TEXT,

        assignedUser TEXT,

        deleted INTEGER DEFAULT 0,
        creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public saveDocument(doc: Document): void {
    const stmt = this.db.prepare(`
      INSERT INTO documentos (roadmap, tefiId, officeId, officeName, officeFileName, officeUrl, officeDate, reportId, 
      reportName, reportFileName, reportUrl, reportDate, assignedUser)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(doc.roadmap, doc.tefiId, doc.officeId, doc.officeName, doc.officeFileName, doc.officeUrl, doc.officeDate,
      doc.reportId, doc.reportName, doc.reportFileName, doc.reportUrl, doc.reportDate, doc.assignedUser);
  }
  // Método para actualizar un documento
  public updateDocument(doc: Document): void {
    const stmt = this.db.prepare(`
      UPDATE documentos SET roadmap = ?, officeId = ?, officeName = ?, officeFileName = ?, officeUrl = ?, officeDate = ?,
      reportId = ?, reportName = ?, reportFileName = ?, reportUrl = ?, reportDate = ?, deleted = ?
      WHERE tefiId = ?
    `);
    stmt.run(doc.roadmap, doc.officeId, doc.officeName, doc.officeFileName, doc.officeUrl, doc.officeDate,
      doc.reportId, doc.reportName, doc.reportFileName, doc.reportUrl, doc.reportDate, doc.deleted, doc.tefiId);
  }

  // Método para obtener todos los documentos
  public getDocuments(): Document[] {
    const stmt = this.db.prepare("SELECT * FROM documentos WHERE deleted = 0");
    return stmt.all() as Document[];
  }

  // Método para buscar documentos por hoja de ruta
  public getDocumentsByRoadMap(roadmap: string): Document[] | null {
    const stmt = this.db.prepare("SELECT * FROM documentos WHERE roadmap = ?");
    return stmt.all(roadmap) as Document[] ?? null;
  }
}

export default DatabaseService;
