import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "data", "academic.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initTables(db);
  }
  return db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notices (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      type        TEXT NOT NULL DEFAULT 'notice',
      category    TEXT NOT NULL DEFAULT '공지',
      title       TEXT NOT NULL,
      content     TEXT DEFAULT '',
      thumbnail   TEXT,
      is_pinned   INTEGER DEFAULT 0,
      created_at  TEXT DEFAULT (datetime('now','localtime')),
      updated_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS admins (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT NOT NULL UNIQUE,
      password    TEXT NOT NULL,
      name        TEXT NOT NULL DEFAULT '',
      created_at  TEXT DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id          TEXT PRIMARY KEY,
      admin_id    INTEGER NOT NULL,
      expires_at  TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      notice_id   INTEGER NOT NULL,
      file_name   TEXT NOT NULL,
      file_path   TEXT NOT NULL,
      file_size   INTEGER DEFAULT 0,
      mime_type   TEXT,
      created_at  TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (notice_id) REFERENCES notices(id) ON DELETE CASCADE
    );
  `);

  // 시드 데이터 삽입 (테이블이 비어있을 때만)
  const count = db.prepare("SELECT COUNT(*) as cnt FROM notices").get() as {
    cnt: number;
  };
  if (count.cnt === 0) {
    seedData(db);
  }

  // 기본 관리자 계정 생성
  const adminCount = db
    .prepare("SELECT COUNT(*) as cnt FROM admins")
    .get() as { cnt: number };
  if (adminCount.cnt === 0) {
    const hashedPassword = bcrypt.hashSync("admin1234", 10);
    db.prepare(
      "INSERT INTO admins (username, password, name) VALUES (?, ?, ?)"
    ).run("admin", hashedPassword, "관리자");
  }
}

function seedData(db: Database.Database) {
  const insert = db.prepare(`
    INSERT INTO notices (type, category, title, content, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const notices = [
    {
      type: "notice",
      category: "공지",
      title: "2026년 상반기 ADDS 데이터 이용 신청 안내",
      content:
        "2026년 상반기 ADDS 데이터 이용 신청 접수를 시작합니다. 연구 목적으로 ADDS 데이터를 활용하고자 하는 연구자분들은 아래 안내사항을 확인하시기 바랍니다.",
      date: "2026-04-15",
    },
    {
      type: "notice",
      category: "공지",
      title: "제5회 알파 세대 디지털 리터러시 학술대회 개최 안내",
      content:
        "연세대학교 SSK ADDS 연구팀에서 제5회 알파 세대 디지털 리터러시 학술대회를 개최합니다. 많은 관심과 참여 부탁드립니다.",
      date: "2026-04-10",
    },
    {
      type: "notice",
      category: "공지",
      title: "연구윤리 교육 이수 안내 (2026년 1차)",
      content:
        "2026년 1차 연구윤리 교육 이수 안내입니다. 모든 연구참여자는 반드시 교육을 이수하시기 바랍니다.",
      date: "2026-04-05",
    },
    {
      type: "notice",
      category: "공지",
      title: "SSK ADDS 연구팀 연구보조원 모집 공고",
      content:
        "SSK ADDS 연구팀에서 연구보조원을 모집합니다. 관심 있는 분들의 많은 지원 바랍니다.",
      date: "2026-03-28",
    },
    {
      type: "notice",
      category: "공지",
      title: "2026년 청소년학회 춘계학술대회 참가 안내",
      content: "2026년 청소년학회 춘계학술대회에 참가 안내드립니다.",
      date: "2026-03-20",
    },
    {
      type: "notice",
      category: "공지",
      title: "ADDS 데이터 활용 연구 논문 공모전 결과 발표",
      content: "ADDS 데이터를 활용한 연구 논문 공모전의 결과를 발표합니다.",
      date: "2026-03-15",
    },
    {
      type: "notice",
      category: "공지",
      title: "2026년 1차 종단 조사 일정 안내",
      content: "2026년 1차 종단 조사 일정을 안내드립니다.",
      date: "2026-03-10",
    },
    {
      type: "notice",
      category: "공지",
      title: "개인정보 처리방침 변경 안내",
      content: "개인정보 처리방침이 변경되었음을 안내드립니다.",
      date: "2026-03-05",
    },
    {
      type: "notice",
      category: "공지",
      title: "홈페이지 리뉴얼 안내",
      content: "ADDS 연구팀 홈페이지가 새롭게 리뉴얼되었습니다.",
      date: "2026-02-28",
    },
    {
      type: "notice",
      category: "공지",
      title: "2025년 하반기 연구 성과 보고서 발간",
      content: "2025년 하반기 연구 성과 보고서를 발간합니다.",
      date: "2026-02-20",
    },
    {
      type: "news",
      category: "보도자료",
      title: "알파 세대 72%, 하루 평균 3시간 이상 디지털 기기 사용",
      content:
        "ADDS 연구팀의 최신 조사 결과, 알파 세대 72%가 하루 평균 3시간 이상 디지털 기기를 사용하는 것으로 나타났습니다.",
      date: "2026-04-12",
    },
    {
      type: "news",
      category: "보도자료",
      title:
        "ADDS 연구팀, 국제 학술지 논문 게재 — 알파 세대 디지털 행동 분석",
      content:
        "ADDS 연구팀이 국제 학술지에 알파 세대 디지털 행동 분석 관련 논문을 게재했습니다.",
      date: "2026-04-08",
    },
    {
      type: "news",
      category: "언론보도",
      title: "연세대 ADDS 연구팀 '디지털 일상 종단 조사' 주목",
      content:
        "연세대 ADDS 연구팀의 디지털 일상 종단 조사가 학계와 언론의 주목을 받고 있습니다.",
      date: "2026-04-01",
    },
    {
      type: "news",
      category: "보도자료",
      title: "청소년 디지털 웰빙 가이드라인 제안 — ADDS 데이터 기반",
      content:
        "ADDS 데이터를 기반으로 청소년 디지털 웰빙 가이드라인을 제안합니다.",
      date: "2026-03-25",
    },
    {
      type: "news",
      category: "언론보도",
      title: "알파 세대 부모 10명 중 7명, 자녀 미디어 사용에 우려",
      content:
        "조사 결과, 알파 세대 부모 10명 중 7명이 자녀의 미디어 사용에 우려를 나타냈습니다.",
      date: "2026-03-18",
    },
    {
      type: "news",
      category: "보도자료",
      title: "ADDS 연구팀, 교육부 정책 간담회 참석",
      content: "ADDS 연구팀이 교육부 정책 간담회에 참석했습니다.",
      date: "2026-03-12",
    },
    {
      type: "news",
      category: "언론보도",
      title: "디지털 네이티브 알파 세대, 학습 방식 변화 분석 결과 발표",
      content:
        "디지털 네이티브인 알파 세대의 학습 방식 변화에 대한 분석 결과를 발표합니다.",
      date: "2026-03-05",
    },
    {
      type: "news",
      category: "보도자료",
      title: "한국 아동·청소년 디지털 역량 국제비교 연구 결과",
      content:
        "한국 아동·청소년의 디지털 역량을 국제비교한 연구 결과를 발표합니다.",
      date: "2026-02-28",
    },
  ];

  const insertMany = db.transaction(() => {
    for (const n of notices) {
      insert.run(n.type, n.category, n.title, n.content, n.date);
    }
  });

  insertMany();
}

export default getDb;
