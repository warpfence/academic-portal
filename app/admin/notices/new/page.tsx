"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function AdminNoticeNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState("notice");
  const [category, setCategory] = useState("공지");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setLoading(true);

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

      if (attachments) {
        for (let i = 0; i < attachments.length; i++) {
          formData.append("attachments", attachments[i]);
        }
      }

      const res = await fetch("/api/notices", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/notices");
      } else {
        const data = await res.json();
        alert(data.error || "저장에 실패했습니다.");
      }
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header variant="solid" />

      <section className="flex-1">
        <div className="max-w-[800px] mx-auto px-10 py-12">
          <h1 className="text-[#171719] font-bold text-2xl leading-8 tracking-[-0.552px] mb-8">
            새 공지 작성
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setThumbnail(e.target.files?.[0] || null)
                }
                className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-sm text-[#6d6d6d] file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#72bf44]/10 file:text-[#72bf44] hover:file:bg-[#72bf44]/20"
              />
            </div>

            {/* 첨부파일 */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-[#171719]">
                첨부파일
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setAttachments(e.target.files)}
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
                disabled={loading}
                className="px-6 py-3 bg-[#72bf44] text-white font-bold text-sm rounded-lg hover:bg-[#5da636] transition-colors disabled:opacity-50"
              >
                {loading ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
