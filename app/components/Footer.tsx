import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#fafafa] h-[182px] overflow-hidden">
      <div className="max-w-[1200px] mx-auto h-full flex items-center gap-8">
        {/* Footer Logo */}
        <Image
          src="/images/logo-footer.png"
          alt="ADDS 로고"
          width={58}
          height={58}
        />

        {/* Organization Info */}
        <div className="flex flex-col gap-0.5">
          <p className="text-black font-bold text-lg leading-[26px] tracking-[-0.414px]">
            연세대학교 SSK ADDS 연구팀
          </p>
          <p className="text-black font-bold text-lg leading-[26px] tracking-[-0.414px]">
            Alpha generation Digital Daily Survey
          </p>
        </div>

        {/* Address & Copyright */}
        <div className="ml-auto flex flex-col gap-1">
          <p className="text-black text-base leading-6 tracking-[-0.368px]">
            서울특별시 서대문구 연세로 50 생활과학대학 (삼성관) 219호
          </p>
          <p className="text-black text-base leading-6 tracking-[-0.368px]">
            COPYRIGHTS © COLLEGE OF HUMAN ECOLOGY OF YONSEI. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
