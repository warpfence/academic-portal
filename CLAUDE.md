# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```

## Architecture

**Next.js 14 App Router + SQLite** 기반 학술 연구팀(ADDS) 홈페이지.

### 핵심 구조

- **`lib/db.ts`** — SQLite 연결 싱글턴. 첫 호출 시 `data/academic.db` 생성, 테이블 초기화, 시드 데이터 삽입. WAL 모드 사용.
- **`lib/notices.ts`** — 공지사항/소식 CRUD 헬퍼. `getNotices()`는 type 필터, 검색, 페이지네이션 지원.
- **`lib/auth.ts`** — bcrypt 비밀번호 검증 + UUID 세션 (24시간 만료). DB sessions 테이블 사용.

### DB 스키마 (4 테이블)

- `notices` — type(notice/news), category, title, content, thumbnail, is_pinned
- `attachments` — notice_id(FK), file_name, file_path, file_size, mime_type
- `admins` — username(unique), password(bcrypt hash), name
- `sessions` — id(uuid), admin_id(FK), expires_at

기본 관리자: `admin` / `admin1234`

### API 라우트

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/notices` | GET, POST | 목록(페이지네이션/검색/필터), 생성(FormData) |
| `/api/notices/[id]` | GET, PUT, DELETE | 단건 조회/수정/삭제 |
| `/api/auth` | POST, GET, DELETE | 로그인, 세션확인, 로그아웃 |

파일 업로드는 FormData로 처리. 파일은 `public/uploads/{thumbnails,attachments}/` 에 UUID 파일명으로 저장.

### 페이지 구조

- **`/`** — 메인 (히어로, 연구실적, 미디어, 공지사항, 푸터)
- **`/notices`** — 공지/소식 목록 (클라이언트 컴포넌트, API fetch)
- **`/notices/[id]`** — 상세 페이지 (서버 컴포넌트, 첨부파일 다운로드)
- **`/admin/login`** — 관리자 로그인
- **`/admin/notices`** — 관리자 목록/수정/삭제
- **`/admin/notices/new`**, **`/admin/notices/[id]/edit`** — 작성/수정 폼

### 인증 가드

`app/admin/layout.tsx`가 클라이언트 레이아웃으로 동작. `/admin/login` 제외한 모든 `/admin/*` 경로에서 `GET /api/auth`로 세션 검증. 실패 시 로그인 페이지로 리다이렉트.

### 공통 컴포넌트

- **Header** — `variant="transparent"` (메인 히어로 위) / `variant="solid"` (서브 페이지). `usePathname()`으로 활성 메뉴 표시.
- **Footer** — 연구팀 정보, 주소, 저작권.

## Design Tokens

- **Primary**: `#72bf44` (그린)
- **Grayscale**: `#171719`(텍스트) → `#6d6d6d` → `#bdbdbd` → `#e0e0e0` → `#fafafa`(배경)
- **Font**: Pretendard Variable (CDN, globals.css에서 import)
- **Tracking**: 대부분 `-0.368px` ~ `-1.288px` (피그마 디자인 시스템)

## 주의사항

- TypeScript path alias: `@/*` → 프로젝트 루트 (예: `@/lib/db`)
- `data/*.db`와 `public/uploads/*`는 `.gitignore`에 포함 — git 추적 안 됨
- DB는 런타임에 자동 생성 — 별도 마이그레이션 불필요
- 한국어 UI — 모든 라벨, 메시지는 한국어로 작성
