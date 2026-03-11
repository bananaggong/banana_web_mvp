import Image from "next/image";
import StickyScrollFeatures from "@/components/StickyScrollFeatures";

export default function Page() {
  return (
    <div className="font-sans text-gray-900 antialiased">
      {/* ================================================================
          HEADER
      ================================================================ */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-800 bg-white px-4 sm:px-6 md:px-12 lg:px-16" style={{ fontFamily: '"Pretendard Variable", "Pretendard", sans-serif', fontWeight: 500 }}>
        {/* 좌측: 로고 */}
        <a href="/" className="flex shrink-0 items-center">
          <img src="/banana1.svg" alt="Banana Technology" className="h-8 w-auto sm:h-10" />
        </a>

        {/* 우측: ABOUT → 섹션1, PRODUCTS → 섹션2, VISION → 섹션3 */}
        <nav className="flex items-center gap-4 text-xs tracking-wide text-gray-900 sm:gap-6 sm:text-sm md:gap-8">
          <a href="#about" className="hover:opacity-70">ABOUT</a>
          <a href="#products" className="hover:opacity-70">PRODUCTS</a>
          <a href="#vision" className="hover:opacity-70">VISION</a>
        </nav>
      </header>

      <main>
        {/* ================================================================
            SECTION 0: VIDEO HERO — 1920×1335 비율 전체 너비 비디오 영역
        ================================================================ */}
        <section className="relative w-full overflow-hidden">
          {/* 비디오 */}
          <video
            src="/main.webm"
            autoPlay
            loop
            muted
            playsInline
            className="aspect-[1920/1335] w-full object-cover"
          />
          {/* 어두운 그림자 오버레이 */}
          <div className="absolute inset-0 bg-black/40" />
          {/* 오버레이 텍스트 — 반응형: 모바일 중앙정렬, 데스크톱 좌측 */}
          <div className="absolute inset-0 flex items-center justify-center px-4 pt-[3%] sm:px-8 md:items-start md:justify-start md:px-12 md:pt-[5%] lg:px-20 lg:pt-[3%]">
            <h1
              style={{
                fontFamily: '"GangwonEduTountoun", sans-serif',
                fontWeight: 700,
                color: "#FFFFFF",
                width: "fit-content",
                letterSpacing: "-0.02em",
              }}
              className="text-center text-4xl leading-tight sm:text-6xl sm:leading-tight md:text-left md:text-7xl md:leading-tight lg:text-[120px] lg:leading-[130px] xl:text-[202px] xl:leading-[218px] xl:tracking-[-3.89px]"
            >
              We Build<br />
              Infrastructure<br />
              For Execution
            </h1>
          </div>
        </section>

        {/* ================================================================
            SECTION 1: HERO (ABOUT)
        ================================================================ */}
        {/* 영상 ↔ 아이디어 텍스트 간격 252px (반응형) */}
        <section id="about" className="mx-auto max-w-[956px] px-4 pb-0 pt-16 sm:px-6 sm:pt-24 md:pt-32 lg:pt-[252px] lg:px-0">
          {/* 부제목 + 설명 + 이미지 */}
          <div className="w-full">
            <div className="flex flex-col items-start text-left">
              <h2 className="text-2xl leading-snug text-gray-900 sm:text-3xl md:text-[38px]" style={{ fontFamily: '"Pretendard Variable", "Pretendard", sans-serif', fontWeight: 700 }}>
                아이디어를 
                <br />
                실행으로 연결하는 BANANA.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-gray-500 sm:mt-4 sm:text-lg md:text-[22px]" style={{ fontFamily: '"Pretendard Variable", "Pretendard", sans-serif', fontWeight: 500 }}>
                정보와 도구는 넘쳐나지만 무엇을 먼저 해야 할지 판단하기는 여전히 어렵습니다.
                <br />
                Banana Technology는 AI와 데이터 기술을 통해 판단, 전략, 실행을 연결하는 시스템을 만듭니다.
              </p>
            </div>

            {/* 히어로 이미지 — 989×548 비율 유지 */}
            <div className="mt-8 overflow-hidden rounded-xl shadow-2xl sm:mt-12 sm:rounded-2xl">
              <Image
                src="/HeroImg.png"
                alt="Hero"
                width={989}
                height={548}
                className="w-full object-cover"
                priority
              />
            </div>
          </div>
          {/* 히어로 이미지 ↔ 섹션2 타이틀 간격 350px (반응형) */}
          <div className="h-20 sm:h-28 md:h-40 lg:h-[350px]" aria-hidden />
        </section>

        {/* ================================================================
            SECTION 2: FEATURES (PRODUCTS)
        ================================================================ */}
        <section id="products" className="pb-12 pt-0 sm:pb-16 md:pb-20">
          {/* 섹션 타이틀 */}
          <div className="mx-auto max-w-[1136px] px-4 pb-10 sm:px-6 sm:pb-12 md:pb-16 lg:px-0">
            <h2 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
              BANANA가 실행을 위해 만든{" "}
              <br />
              
              <span style={{ color: "#0234FD" }}>세 가지 핵심 시스템</span>{" "}
            </h2>
          </div>

          {/* 스티키 스크롤 피처 (HeroImage와 독립 — 자체 sticky 이미지 보유) */}
          <StickyScrollFeatures />
        </section>

        {/* ================================================================
            SECTION 3: BRAND MESSAGE (VISION)
        ================================================================ */}
        <section id="vision" className="mt-16 w-full bg-gray-100 px-4 py-16 sm:mt-24 sm:px-6 sm:py-20 md:mt-32 md:py-24 lg:mt-[250px] lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1136px]">

            {/* 윗 텍스트 — Pretendard Bold, 반응형 */}
            <h2 className="text-3xl leading-snug text-gray-900 sm:text-4xl md:text-5xl lg:text-[60px]" style={{ fontFamily: '"Pretendard Variable", "Pretendard", sans-serif', fontWeight: 700 }}>
              더 이상의 우연은 없습니다<br />
              견고한 실행 표준이 살아 남습니다
            </h2>

            {/* 노란선 — rounded 없음, 반응형 시 '실행 표준' 위치까지 길이 */}
            <div className="mt-4 mb-8 h-3 w-72 bg-yellow-400 sm:mb-10 sm:mt-5 sm:h-4 sm:w-80 md:mb-12 md:w-96 lg:w-[420px]" />

            {/* 아랫 텍스트 — Pretendard Regular, 반응형 */}
            <p className="text-lg leading-relaxed text-gray-600 sm:text-xl md:text-2xl lg:text-[37px]" style={{ fontFamily: '"Pretendard Variable", "Pretendard", sans-serif', fontWeight: 400 }}>
              정보가 넘쳐날수록 가장 강력한 자산은 '정확한 판단'과 '실행의 일관성'입니다.
              바나나테크놀러지는 AI와 데이터를 통해 비즈니스의 모든 노이즈를 제거하고
              아이디어가 즉시 실현되는 표준 체계를 만듭니다.
              우리는 불확실한 미래 속에서 가장 확실한 이정표가 될 것입니다.
            </p>

          </div>
        </section>
      </main>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer className="bg-slate-950 px-4 pt-12 pb-8 sm:px-6 sm:pt-16 sm:pb-10 lg:px-16 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 pt-0 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-relaxed text-slate-400">
              주식회사 바나나테크놀러지 &nbsp;|&nbsp; 대표 김시원 &nbsp;|&nbsp; 사업자등록번호 218-88-03697
              <br className="md:hidden" />
              <span className="hidden md:inline"> &nbsp;|&nbsp; </span>
              (우) 04072 서울특별시 마포구 독막로6길 9 (합정동) 2층 416호
            </p>
            <div className="flex items-center gap-5 text-xs text-slate-400">
              <a href="#" className="font-semibold transition hover:text-slate-300"></a>
              <a href="#" className="transition hover:text-slate-300"></a>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Contact:{" "}
            <a href="mailto:contact@bananacompany.ai" className="transition hover:text-white">
              contact@bananacompany.ai
            </a>
          </p>

          <p className="mt-4 text-xs text-slate-400">
            Copyright ⓒ 2026 BananaTechnology. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
