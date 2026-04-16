"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

type TabType = "notice" | "news";

interface NoticeItem {
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

interface NoticeListResponse {
  items: NoticeItem[];
  total: number;
  page: number;
  totalPages: number;
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
        stroke="#6d6d6d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="#BDBDBD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightSmallIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 15L12.5 10L7.5 5"
        stroke="#BDBDBD"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon({ color = "#BDBDBD" }: { color?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function isNew(dateStr: string): boolean {
  const created = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export default function NoticesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("notice");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState<NoticeListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("type", activeTab);
      params.set("page", String(currentPage));
      params.set("limit", "10");
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      const res = await fetch(`/api/notices?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("데이터 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchQuery]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
    setSearchInput("");
  };

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header variant="solid" />

      {/* Page Hero */}
      <section className="bg-[#fafafa] border-b border-[#f0f0f0]">
        <div className="max-w-[1280px] mx-auto px-10 py-16">
          <p className="text-[#6d6d6d] font-medium text-lg leading-[26px] tracking-[-0.414px]">
            NEWS & NOTICE
          </p>
          <h1 className="text-black font-bold text-[42px] leading-[56px] tracking-[-0.966px] mt-2">
            소식/공지사항
          </h1>
          <p className="text-[#6d6d6d] text-base leading-6 tracking-[-0.368px] mt-3">
            ADDS 연구팀의 최신 소식과 공지사항을 확인하세요.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1">
        <div className="max-w-[1280px] mx-auto px-10 py-12">
          {/* Tabs + Search */}
          <div className="flex items-center justify-between mb-8">
            {/* Tabs */}
            <div className="flex gap-1">
              <button
                onClick={() => handleTabChange("notice")}
                className={`px-6 py-3 rounded-full font-bold text-base leading-6 tracking-[-0.368px] transition-colors ${
                  activeTab === "notice"
                    ? "bg-[#72bf44] text-white"
                    : "bg-[#fafafa] text-[#6d6d6d] hover:bg-[#f0f0f0]"
                }`}
              >
                공지사항
              </button>
              <button
                onClick={() => handleTabChange("news")}
                className={`px-6 py-3 rounded-full font-bold text-base leading-6 tracking-[-0.368px] transition-colors ${
                  activeTab === "news"
                    ? "bg-[#72bf44] text-white"
                    : "bg-[#fafafa] text-[#6d6d6d] hover:bg-[#f0f0f0]"
                }`}
              >
                소식
              </button>
            </div>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-[#fafafa] rounded-xl px-4 py-2.5 w-[320px]"
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent flex-1 text-base leading-6 tracking-[-0.368px] text-[#171719] placeholder:text-[#bdbdbd] outline-none"
              />
            </form>
          </div>

          {/* Total Count */}
          <div className="mb-4 text-sm text-[#6d6d6d]">
            총 <span className="font-bold text-[#171719]">{total}</span>건
          </div>

          {/* List Header */}
          <div className="flex items-center border-b-2 border-[#171719] pb-3 mb-0">
            <span className="w-[80px] text-center font-bold text-sm leading-5 tracking-[-0.322px] text-[#6d6d6d]">
              번호
            </span>
            <span className="w-[100px] text-center font-bold text-sm leading-5 tracking-[-0.322px] text-[#6d6d6d]">
              분류
            </span>
            <span className="flex-1 font-bold text-sm leading-5 tracking-[-0.322px] text-[#6d6d6d]">
              제목
            </span>
            <span className="w-[120px] text-center font-bold text-sm leading-5 tracking-[-0.322px] text-[#6d6d6d]">
              등록일
            </span>
            <span className="w-[40px]" />
          </div>

          {/* List Items */}
          {loading ? (
            <div className="py-20 text-center text-[#bdbdbd]">
              불러오는 중...
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center text-[#bdbdbd]">
              등록된 게시글이 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-[#f0f0f0]">
              {items.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/notices/${item.id}`}
                  className="flex items-center py-5 cursor-pointer group hover:bg-[#fafafa] transition-colors -mx-4 px-4 rounded-lg"
                >
                  <span className="w-[80px] text-center text-base leading-6 tracking-[-0.368px] text-[#bdbdbd]">
                    {total - ((currentPage - 1) * 10 + index)}
                  </span>
                  <span className="w-[100px] text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium leading-4 ${
                        item.category === "공지"
                          ? "bg-[#72bf44]/10 text-[#72bf44]"
                          : item.category === "보도자료"
                          ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                          : "bg-[#f59e0b]/10 text-[#f59e0b]"
                      }`}
                    >
                      {item.category}
                    </span>
                  </span>
                  <span className="flex-1 flex items-center gap-2">
                    {item.is_pinned === 1 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#72bf44] text-white">
                        고정
                      </span>
                    )}
                    <span className="font-medium text-base leading-6 tracking-[-0.368px] text-[#171719] group-hover:text-[#72bf44] transition-colors">
                      {item.title}
                    </span>
                    {isNew(item.created_at) && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#72bf44] text-white text-[10px] font-bold leading-none">
                        N
                      </span>
                    )}
                  </span>
                  <span className="w-[120px] text-center text-base leading-6 tracking-[-0.368px] text-[#6d6d6d]">
                    {formatDate(item.created_at)}
                  </span>
                  <span className="w-[40px] flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRightIcon color="#72bf44" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#fafafa] transition-colors disabled:opacity-50"
              >
                <ChevronLeftIcon />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-base leading-6 tracking-[-0.368px] transition-colors ${
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
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#fafafa] transition-colors disabled:opacity-50"
              >
                <ChevronRightSmallIcon />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
