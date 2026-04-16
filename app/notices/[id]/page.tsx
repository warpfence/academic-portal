import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { getNoticeById, getAttachmentsByNoticeId } from "@/lib/notices";
import { notFound } from "next/navigation";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.667 2.5H5.00033C4.55831 2.5 4.13438 2.67559 3.82182 2.98816C3.50926 3.30072 3.33366 3.72464 3.33366 4.16667V15.8333C3.33366 16.2754 3.50926 16.6993 3.82182 17.0118C4.13438 17.3244 4.55831 17.5 5.00033 17.5H15.0003C15.4424 17.5 15.8663 17.3244 16.1788 17.0118C16.4914 16.6993 16.667 16.2754 16.667 15.8333V7.5L11.667 2.5Z"
        stroke="#6d6d6d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.667 2.5V7.5H16.667"
        stroke="#6d6d6d"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticeId = parseInt(id, 10);
  const notice = getNoticeById(noticeId);

  if (!notice) {
    notFound();
  }

  const attachments = getAttachmentsByNoticeId(noticeId);

  const categoryStyle =
    notice.category === "공지"
      ? "bg-[#72bf44]/10 text-[#72bf44]"
      : notice.category === "보도자료"
      ? "bg-[#3b82f6]/10 text-[#3b82f6]"
      : "bg-[#f59e0b]/10 text-[#f59e0b]";

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
        </div>
      </section>

      {/* Content */}
      <section className="flex-1">
        <div className="max-w-[1280px] mx-auto px-10 py-12">
          {/* Notice Header */}
          <div className="border-b-2 border-[#171719] pb-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium leading-4 ${categoryStyle}`}
              >
                {notice.category}
              </span>
              <span className="text-[#bdbdbd] text-sm">
                {formatDate(notice.created_at)}
              </span>
            </div>
            <h2 className="text-[#171719] font-bold text-2xl leading-8 tracking-[-0.552px]">
              {notice.title}
            </h2>
          </div>

          {/* Notice Body */}
          <div className="min-h-[300px] pb-8 border-b border-[#f0f0f0]">
            <div className="text-[#171719] text-base leading-7 tracking-[-0.368px] whitespace-pre-wrap">
              {notice.content}
            </div>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="py-6 border-b border-[#f0f0f0]">
              <h3 className="font-bold text-sm text-[#6d6d6d] mb-3">
                첨부파일
              </h3>
              <div className="flex flex-col gap-2">
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.file_path}
                    download={attachment.file_name}
                    className="flex items-center gap-2 px-4 py-3 bg-[#fafafa] rounded-lg hover:bg-[#f0f0f0] transition-colors group"
                  >
                    <FileIcon />
                    <span className="text-[#171719] text-sm font-medium group-hover:text-[#72bf44] transition-colors">
                      {attachment.file_name}
                    </span>
                    <span className="text-[#bdbdbd] text-xs ml-1">
                      ({formatFileSize(attachment.file_size)})
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/notices"
              className="inline-flex items-center justify-center px-8 py-3 border border-[#e0e0e0] rounded-lg text-[#6d6d6d] font-medium text-base hover:bg-[#fafafa] transition-colors"
            >
              목록으로
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
