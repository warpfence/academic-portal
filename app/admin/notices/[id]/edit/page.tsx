"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

interface Notice {
  id: number;
  type: string;
  category: string;
  title: string;
  content: string;
  thumbnail: string | null;
  is_pinned: number;
  created_at: string;
}

interface Attachment {
  id: number;
  notice_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminNoticeEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [type, setType] = useState("notice");
  const [category, setCategory] = useState("공지");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);
  const [newAttachments, setNewAttachments] = useState<FileList | null>(null);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(
    []
  );
  const [deleteAttachmentIds, setDeleteAttachmentIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) {
          alert("공지사항을 찾을 수 없습니다.");
          router.push("/admin/notices");
          return;
        }
        const data = await res.json();
        const notice: Notice = data.notice;
        const attachments: Attachment[] = data.attachments;

        setType(notice.type);
        setCategory(notice.category);
        setTitle(notice.title);
        setContent(notice.content || "");
        setIsPinned(notice.is_pinned === 1);
        setCurrentThumbnail(notice.thumbnail);
        setExistingAttachments(attachments);
      } catch {
        alert("데이터 조회 중 오류가 발생했습니다.");
        router.push("/admin/notices");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, router]);

  const handleDeleteAttachment = (attachmentId: number) => {
    setDeleteAttachmentIds((prev) => [...prev, attachmentId]);
    setExistingAttachments((prev) =>
      prev.filter((a) => a.id !== attachmentId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("is_pinned", String(isPinned));

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      for (const attachmentId of deleteAttachmentIds) {
        formData.append("delete_attachments", String(attachmentId));
      }

      if (newAttachments) {
        for (let i = 0; i < newAttachments.length; i++) {
          formData.append("attachments", newAttachments[i]);
        }
      }

      const res = await fetch(`/api/notices/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/notices");
      } else {
        const data = await res.json();
        alert(data.error || "수정에 실패했습니다.");
      }
    } catch {
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-white min-h-screen flex flex-col">
        <Header variant="solid" />
        <section className="flex-1 flex items-center justify-center">
          <p className="text-[#bdbdbd]">불러오는 중...</p>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header variant="solid" />

      <section className="flex-1">
        <div className="max-w-[800px] mx-auto px-10 py-12">
          <h1 className="text-[#171719] font-bold text-2xl leading-8 tracking-[-0.552px] mb-8">
            공지사항 수정
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 분류 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-[#171719]">분류</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#171719] bg-white outline-none focus:border-[#72bf44] transition-colors"
              >
                <option value="notice">공지사항</option>
                <option value="news">소식</option>
              </select>
            </div>

            {/* 카테고리 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-[#171719]">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#171719] bg-white outline-none focus:border-[#72bf44] transition-colors"
              >
                <option value="공지">공지</option>
                <option value="보도자료">보도자료</option>
                <option value="언론보도">언론보도</option>
              </select>
            </div>

            {/* 제목 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-[#171719]">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#171719] placeholder:text-[#bdbdbd] outline-none focus:border-[#72bf44] transition-colors"
              />
            </div>

            {/* 본문 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-[#171719]">본문</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="본문 내용을 입력하세요"
                rows={12}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#171719] placeholder:text-[#bdbdbd] outline-none focus:border-[#72bf44] transition-colors resize-y"
              />
            </div>

            {/* 상단고정 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_pinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded border-[#e0e0e0] text-[#72bf44] focus:ring-[#72bf44]"
              />
              <label
                htmlFor="is_pinned"
                className="text-sm text-[#171719] font-medium"
              >
                상단 고정
              </label>
            </div>

            {/* 썸네일 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-[#171719]">
                썸네일 이미지
              </label>
              {currentThumbnail && !thumbnail && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-[#6d6d6d]">
                    현재 썸네일: {currentThumbnail}
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setThumbnail(e.target.files?.[0] || null)
                }
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#6d6d6d] file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#72bf44]/10 file:text-[#72bf44] hover:file:bg-[#72bf44]/20"
              />
            </div>

            {/* 기존 첨부파일 */}
            {existingAttachments.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-[#171719]">
                  기존 첨부파일
                </label>
                <div className="flex flex-col gap-2">
                  {existingAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between px-4 py-3 bg-[#fafafa] rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#171719]">
                          {attachment.file_name}
                        </span>
                        <span className="text-xs text-[#bdbdbd]">
                          ({formatFileSize(attachment.file_size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 새 첨부파일 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-[#171719]">
                새 첨부파일 추가
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setNewAttachments(e.target.files)}
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#6d6d6d] file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#72bf44]/10 file:text-[#72bf44] hover:file:bg-[#72bf44]/20"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/notices")}
                className="px-6 py-3 border border-[#e0e0e0] rounded-lg text-sm font-medium text-[#6d6d6d] hover:bg-[#fafafa] transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#72bf44] text-white font-bold text-sm rounded-lg hover:bg-[#5da636] transition-colors disabled:opacity-50"
              >
                {saving ? "저장 중..." : "수정"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
