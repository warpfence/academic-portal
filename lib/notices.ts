import getDb from "./db";

export interface Notice {
  id: number;
  type: string;
  category: string;
  title: string;
  content: string;
  thumbnail: string | null;
  is_pinned: number;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: number;
  notice_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface NoticeListParams {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface NoticeListResult {
  items: Notice[];
  total: number;
  page: number;
  totalPages: number;
}

export function getNotices(params: NoticeListParams = {}): NoticeListResult {
  const db = getDb();
  const { type, search, page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const bindParams: unknown[] = [];

  if (type) {
    whereClause += " AND type = ?";
    bindParams.push(type);
  }

  if (search) {
    whereClause += " AND (title LIKE ? OR content LIKE ?)";
    bindParams.push(`%${search}%`, `%${search}%`);
  }

  const countRow = db
    .prepare(`SELECT COUNT(*) as cnt FROM notices ${whereClause}`)
    .get(...bindParams) as { cnt: number };

  const total = countRow.cnt;
  const totalPages = Math.ceil(total / limit);

  const items = db
    .prepare(
      `SELECT * FROM notices ${whereClause} ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?`
    )
    .all(...bindParams, limit, offset) as Notice[];

  return { items, total, page, totalPages };
}

export function getNoticeById(id: number): Notice | null {
  const db = getDb();
  const notice = db
    .prepare("SELECT * FROM notices WHERE id = ?")
    .get(id) as Notice | undefined;
  return notice || null;
}

export function getAttachmentsByNoticeId(noticeId: number): Attachment[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM attachments WHERE notice_id = ? ORDER BY id ASC")
    .all(noticeId) as Attachment[];
}

export interface CreateNoticeData {
  type: string;
  category: string;
  title: string;
  content: string;
  thumbnail?: string;
  is_pinned?: boolean;
}

export function createNotice(data: CreateNoticeData): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO notices (type, category, title, content, thumbnail, is_pinned)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      data.type,
      data.category,
      data.title,
      data.content,
      data.thumbnail || null,
      data.is_pinned ? 1 : 0
    );

  return result.lastInsertRowid as number;
}

export function updateNotice(
  id: number,
  data: Partial<CreateNoticeData>
): boolean {
  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.type !== undefined) {
    fields.push("type = ?");
    values.push(data.type);
  }
  if (data.category !== undefined) {
    fields.push("category = ?");
    values.push(data.category);
  }
  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }
  if (data.content !== undefined) {
    fields.push("content = ?");
    values.push(data.content);
  }
  if (data.thumbnail !== undefined) {
    fields.push("thumbnail = ?");
    values.push(data.thumbnail);
  }
  if (data.is_pinned !== undefined) {
    fields.push("is_pinned = ?");
    values.push(data.is_pinned ? 1 : 0);
  }

  if (fields.length === 0) return false;

  fields.push("updated_at = datetime('now','localtime')");
  values.push(id);

  const result = db
    .prepare(`UPDATE notices SET ${fields.join(", ")} WHERE id = ?`)
    .run(...values);

  return result.changes > 0;
}

export function deleteNotice(id: number): boolean {
  const db = getDb();
  const result = db.prepare("DELETE FROM notices WHERE id = ?").run(id);
  return result.changes > 0;
}

export function addAttachment(
  noticeId: number,
  fileName: string,
  filePath: string,
  fileSize: number,
  mimeType: string
): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO attachments (notice_id, file_name, file_path, file_size, mime_type)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(noticeId, fileName, filePath, fileSize, mimeType);

  return result.lastInsertRowid as number;
}

export function deleteAttachment(id: number): Attachment | null {
  const db = getDb();
  const attachment = db
    .prepare("SELECT * FROM attachments WHERE id = ?")
    .get(id) as Attachment | undefined;

  if (attachment) {
    db.prepare("DELETE FROM attachments WHERE id = ?").run(id);
  }

  return attachment || null;
}
