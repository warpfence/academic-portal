import { NextRequest, NextResponse } from "next/server";
import {
  getNoticeById,
  getAttachmentsByNoticeId,
  updateNotice,
  deleteNotice,
  addAttachment,
  deleteAttachment,
} from "@/lib/notices";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const noticeId = parseInt(id, 10);
  const notice = getNoticeById(noticeId);

  if (!notice) {
    return NextResponse.json(
      { error: "공지사항을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const attachments = getAttachmentsByNoticeId(noticeId);
  return NextResponse.json({ notice, attachments });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noticeId = parseInt(id, 10);
    const existingNotice = getNoticeById(noticeId);

    if (!existingNotice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const category = formData.get("category") as string;
    const content = formData.get("content") as string;
    const isPinned = formData.get("is_pinned") === "true";

    // 썸네일 처리
    let thumbnailPath: string | undefined;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      // 기존 썸네일 삭제
      if (existingNotice.thumbnail) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          existingNotice.thumbnail
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

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

    // 공지사항 업데이트
    updateNotice(noticeId, {
      title,
      type,
      category,
      content,
      is_pinned: isPinned,
      ...(thumbnailPath ? { thumbnail: thumbnailPath } : {}),
    });

    // 삭제할 첨부파일 처리
    const deleteAttachmentIds = formData.getAll(
      "delete_attachments"
    ) as string[];
    for (const attachmentId of deleteAttachmentIds) {
      const attachment = deleteAttachment(parseInt(attachmentId, 10));
      if (attachment) {
        const filePath = path.join(
          process.cwd(),
          "public",
          attachment.file_path
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // 새 첨부파일 처리
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("공지사항 수정 오류:", error);
    return NextResponse.json(
      { error: "공지사항 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noticeId = parseInt(id, 10);
    const notice = getNoticeById(noticeId);

    if (!notice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 썸네일 파일 삭제
    if (notice.thumbnail) {
      const thumbnailPath = path.join(
        process.cwd(),
        "public",
        notice.thumbnail
      );
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // 첨부파일 삭제
    const attachments = getAttachmentsByNoticeId(noticeId);
    for (const attachment of attachments) {
      const filePath = path.join(
        process.cwd(),
        "public",
        attachment.file_path
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // DB에서 삭제 (CASCADE로 첨부파일도 삭제됨)
    deleteNotice(noticeId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("공지사항 삭제 오류:", error);
    return NextResponse.json(
      { error: "공지사항 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
