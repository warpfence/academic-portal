import { NextRequest, NextResponse } from "next/server";
import { getNotices, createNotice, addAttachment } from "@/lib/notices";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const result = getNotices({ type, search, page, limit });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const type = (formData.get("type") as string) || "notice";
    const category = (formData.get("category") as string) || "공지";
    const content = (formData.get("content") as string) || "";
    const isPinned = formData.get("is_pinned") === "true";

    if (!title) {
      return NextResponse.json(
        { error: "제목은 필수입니다." },
        { status: 400 }
      );
    }

    // 썸네일 파일 처리
    let thumbnailPath: string | undefined;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      const ext = path.extname(thumbnailFile.name);
      const fileName = `${uuidv4()}${ext}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/thumbnails");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      thumbnailPath = `/uploads/thumbnails/${fileName}`;
    }

    // 공지사항 생성
    const noticeId = createNotice({
      type,
      category,
      title,
      content,
      thumbnail: thumbnailPath,
      is_pinned: isPinned,
    });

    // 첨부파일 처리
    const attachmentFiles = formData.getAll("attachments") as File[];
    for (const file of attachmentFiles) {
      if (file.size > 0) {
        const ext = path.extname(file.name);
        const fileName = `${uuidv4()}${ext}`;
        const uploadDir = path.join(
          process.cwd(),
          "public/uploads/attachments"
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        addAttachment(
          noticeId,
          file.name,
          `/uploads/attachments/${fileName}`,
          file.size,
          file.type
        );
      }
    }

    return NextResponse.json({ id: noticeId }, { status: 201 });
  } catch (error) {
    console.error("공지사항 생성 오류:", error);
    return NextResponse.json(
      { error: "공지사항 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
