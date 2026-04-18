import getDb from "./db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export interface Admin {
  id: number;
  username: string;
  name: string;
  created_at: string;
}

interface AdminRow extends Admin {
  password: string;
}

const SESSION_DURATION_HOURS = 24;

export function verifyCredentials(
  username: string,
  password: string
): Admin | null {
  const db = getDb();
  const admin = db
    .prepare("SELECT * FROM admins WHERE username = ?")
    .get(username) as AdminRow | undefined;

  if (!admin) return null;
  if (!bcrypt.compareSync(password, admin.password)) return null;

  const { password: _password, ...adminData } = admin;
  void _password;
  return adminData;
}

export function createSession(adminId: number): string {
  const db = getDb();
  const sessionId = uuidv4();
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000
  ).toISOString();

  // 만료된 세션 정리
  db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();

  db.prepare(
    "INSERT INTO sessions (id, admin_id, expires_at) VALUES (?, ?, ?)"
  ).run(sessionId, adminId, expiresAt);

  return sessionId;
}

export function validateSession(sessionId: string): Admin | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT a.id, a.username, a.name, a.created_at
       FROM sessions s JOIN admins a ON s.admin_id = a.id
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    )
    .get(sessionId) as Admin | undefined;

  return row || null;
}

export function deleteSession(sessionId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}
