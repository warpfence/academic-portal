import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

const researchData = [
  {
    id: "01",
    category: "청소년학연구",
    title: "학교 밖 청소년의 낙인감과 자기통제의\n종단적 관계가 성인 진입기 위험 행동에\n미치는 영향",
    authors: "김민경, 유재형, 김세훈",
    publisher: "서울대학교 철학사상연구소 | 2026",
  },
  {
    id: "02",
    category: "청소년학연구",
    title: "학교 밖 청소년의 낙인감과 자기통제의\n종단적 관계가 성인 진입기 위험 행동에\n미치는 영향",
    authors: "김민경, 유재형, 김세훈",
    publisher: "서울대학교 철학사상연구소 | 2026",
  },
  {
    id: "03",
    category: "청소년학연구",
    title: "학교 밖 청소년의 낙인감과 자기통제의\n종단적 관계가 성인 진입기 위험 행동에\n미치는 영향",
    authors: "김민경, 유재형, 김세훈",
    publisher: "서울대학교 철학사상연구소 | 2026",
  },
];

const mediaData = Array(6).fill({
  title: "청소년 디지털 미디어 리터러시 연구 발표",
});

const noticeData = Array(6).fill({
  title: "토스 비즈니스 서비스 이용약관 변경 안내",
  date: "2026.04.15",
});

function ArrowUpRightIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.33333 22.6667L22.6667 9.33334M22.6667 9.33334H12M22.6667 9.33334V20"
        stroke="#72BF44"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
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
        stroke="#BDBDBD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScrollIcon() {
  return (
    <svg
      width="25"
      height="40"
      viewBox="0 0 25 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="23"
        height="38"
        rx="11.5"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="12.5" cy="12" r="3" fill="white">
        <animate
          attributeName="cy"
          values="12;20;12"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen p-5">
        <div className="relative h-full w-full rounded-[30px] overflow-hidden">
          {/* Background Image */}
          <Image
            src="/images/hero-bg.jpg"
            alt="대구대학교 캠퍼스"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/[0.24]" />

          {/* GNB Navigation */}
          <Header variant="transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {/* Badge */}
            <div className="border border-white rounded-xl px-5 py-2 mb-6">
              <p className="text-white font-medium text-[22px] leading-[30px] tracking-[-0.506px]">
                알파 세대, 피할 수 없는 디지털 대전환 시대
              </p>
            </div>

            {/* Title */}
            <h1 className="text-white font-bold text-[56px] leading-[76px] tracking-[-1.288px] text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.16)]">
              뉴노멀 시대를 위한 혁신,
              <br />
              알파 세대 디지털 일상 종단
              <br />
              ADDS 데이터
            </h1>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 mt-10">
              <button className="bg-white text-[#72bf44] font-bold text-lg leading-[26px] tracking-[-0.414px] h-14 px-8 rounded-xl hover:bg-gray-100 transition-colors">
                연구 실적 보기
              </button>
              <button className="border border-[#e0e0e0] text-white font-bold text-lg leading-[26px] tracking-[-0.414px] h-14 px-8 rounded-xl hover:bg-white/10 transition-colors">
                학과소개
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <p className="text-white/60 font-medium text-lg leading-[26px] tracking-[-0.414px]">
              SCROLL
            </p>
            <ScrollIcon />
          </div>
        </div>
      </section>

      {/* Research Achievements Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-[60px]">
          {/* Heading */}
          <div className="w-full px-10">
            <p className="text-[#6d6d6d] font-medium text-lg leading-[26px] tracking-[-0.414px]">
              RESEARCH ACHIEVEMENTS
            </p>
            <h2 className="text-black font-bold text-4xl leading-[48px] tracking-[-0.828px] mt-1">
              연구 실적
            </h2>
          </div>

          {/* Research Cards */}
          <div className="w-full px-10 flex gap-6">
            {researchData.map((item) => (
              <div
                key={item.id}
                className="flex-1 min-w-0 bg-[#fafafa] rounded-[30px] px-[30px] py-8 flex flex-col gap-8 relative"
              >
                {/* Badge */}
                <div className="self-start bg-white rounded-full px-4 py-2">
                  <span className="text-[#6d6d6d] font-medium text-lg leading-[26px] tracking-[-0.414px]">
                    {item.category}
                  </span>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-[37px] right-[30px]">
                  <ArrowUpRightIcon />
                </div>

                {/* Title */}
                <div className="flex flex-col gap-3">
                  <p className="text-[#72bf44] font-bold text-[32px] leading-[44px] tracking-[-0.736px]">
                    {item.id}
                  </p>
                  <p className="text-black font-bold text-xl leading-7 tracking-[-0.46px] whitespace-pre-line">
                    {item.title}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#e0e0e0]" />

                {/* Author Info */}
                <div className="text-[#6d6d6d] text-base leading-6 tracking-[-0.368px]">
                  <p>{item.authors}</p>
                  <p>{item.publisher}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="bg-[#72bf44] text-white font-bold text-lg leading-[26px] tracking-[-0.414px] h-[60px] w-[230px] rounded-full hover:bg-[#65a93d] transition-colors">
            연구실적 전체보기
          </button>
        </div>
      </section>

      {/* Media Section */}
      <section className="bg-[#fafafa] py-[92px] overflow-hidden">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-[60px]">
          {/* Heading */}
          <div className="w-full">
            <div className="px-10">
              <p className="text-[#6d6d6d] font-medium text-base leading-6 tracking-[-0.368px]">
                MEDIA
              </p>
              <h2 className="text-black font-bold text-[32px] leading-[44px] tracking-[-0.736px] mt-1">
                미디어
              </h2>
            </div>

            {/* Media Cards Grid */}
            <div className="flex flex-col gap-8 mt-8">
              {/* Row 1 */}
              <div className="px-10 flex gap-6">
                {mediaData.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-0 flex flex-col gap-6 rounded-[30px]"
                  >
                    <div className="bg-white h-[240px] rounded-[20px]" />
                    <p className="text-black font-bold text-xl leading-7 tracking-[-0.46px]">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
              {/* Row 2 */}
              <div className="px-10 flex gap-6">
                {mediaData.slice(3, 6).map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-0 flex flex-col gap-6 rounded-[30px]"
                  >
                    <div className="bg-white h-[240px] rounded-[20px]" />
                    <p className="text-black font-bold text-xl leading-7 tracking-[-0.46px]">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-[#72bf44] text-white font-bold text-lg leading-[26px] tracking-[-0.414px] h-[60px] w-[230px] rounded-full hover:bg-[#65a93d] transition-colors">
            유튜브 보러가기
          </button>
        </div>
      </section>

      {/* Notice Section */}
      <section className="py-0 overflow-hidden">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-[60px] min-h-[1024px] justify-center">
          {/* Heading */}
          <div className="w-full px-10">
            <p className="text-[#6d6d6d] font-medium text-lg leading-[26px] tracking-[-0.414px]">
              NOTICE
            </p>
            <h2 className="text-black font-bold text-4xl leading-[48px] tracking-[-0.828px] mt-1">
              공지사항
            </h2>
          </div>

          {/* Notice List */}
          <div className="w-full flex flex-col gap-10 max-w-[1200px]">
            {noticeData.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between h-14 cursor-pointer group"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-black font-bold text-xl leading-7 tracking-[-0.46px] group-hover:text-[#72bf44] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[#6d6d6d] text-base leading-6 tracking-[-0.368px]">
                    {item.date}
                  </p>
                </div>
                <ChevronRightIcon />
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/notices"
            className="bg-[#72bf44] text-white font-bold text-lg leading-[26px] tracking-[-0.414px] h-[60px] w-[230px] rounded-full hover:bg-[#65a93d] transition-colors flex items-center justify-center"
          >
            공지사항 전체보기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
