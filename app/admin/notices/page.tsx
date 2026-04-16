"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface NoticeItem {
  id: number;
  type: string;
  category: string;
  title: string;
  is_pinned: number;
  created_at: string;
}

interface NoticeListResponse {
  items: NoticeItem[];
  total: number;
  page: number;
  totalPages: number;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export default function AdminNoticesPage() {
  const [data, setData] = useState<NoticeListResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", "20");
      const res = await fetch(`/api/notices?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("데이터 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) return;

    try {
      const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchNotices();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header variant="solid" />

      <section className="flex-1">
        <div className="max-w-[1280px] mx-auto px-10 py-12">
          {/* Title + Action */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[#171719] font-bold text-2xl leading-8 tracking-[-0.552px]">
              공지사항 관리
            </h1>
            <Link
              href="/admin/notices/new"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#72bf44] text-white font-bold text-sm rounded-lg hover:bg-[#5da636] transition-colors"
            >
              새 공지 작성
            </Link>
          </div>

          {/* Table */}
          <div className="border border-[#e0e0e0] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                  <th className="w-[60px] py-3 text-center font-bold text-sm text-[#6d6d6d]">
                    ID
                  </th>
                  <th className="w-[80px] py-3 text-center font-bold text-sm text-[#6d6d6d]">
                    분류
                  </th>
                  <th className="py-3 text-left pl-4 font-bold text-sm text-[#6d6d6d]">
                    제목
                  </th>
                  <th className="w-[120px] py-3 text-center font-bold text-sm text-[#6d6d6d]">
                    등록일
                  </th>
                  <th className="w-[160px] py-3 text-center font-bold text-sm text-[#6d6d6d]">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-20 text-center text-[#bdbdbd]"
                    >
                      불러오는 중...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-20 text-center text-[#bdbdbd]"
                    >
                      등록된 게시글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="py-4 text-center text-sm text-[#bdbdbd]">
                        {item.id}
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.category === "공지"
                              ? "bg-[#72bf44]/10 text-[#72bf44]"
                              : item.category === "보도자료"
                              ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                              : "bg-[#f59e0b]/10 text-[#f59e0b]"
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-2">
                          {item.is_pinned === 1 && (
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#72bf44] text-white">
                              고정
                            </span>
                          )}
                          <span className="text-sm text-[#171719] font-medium">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-sm text-[#6d6d6d]">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/notices/${item.id}/edit`}
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-[#e0e0e0] rounded-md text-xs font-medium text-[#6d6d6d] hover:bg-[#fafafa] transition-colors"
                          >
                            수정
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-[#e0e0e0] rounded-md text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-[#6d6d6d] hover:bg-[#fafafa] rounded-lg transition-colors disabled:opacity-50"
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-[#72bf44] text-white"
                        : "text-[#6d6d6d] hover:bg-[#fafafa]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-[#6d6d6d] hover:bg-[#fafafa] rounded-lg transition-colors disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
