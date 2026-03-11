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
        <section id="vision" className="mt-16 w-full bg-gray-100 px-4 py-12 sm:mt-24 sm:px-6 sm:py-16 md:mt-32 md:py-20 lg:mt-[250px] lg:px-16">
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

          {/* ── 상단: 브랜드 + SNS ── */}
          <div className="flex flex-col gap-6 border-b border-slate-800 pb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-2xl font-bold tracking-tight text-white">
                Banana Technology
              </p>
              <p className="mt-2 text-sm text-slate-400">
                We Build Infrastructure For Execution.
              </p>
            </div>
            {/* SNS 아이콘 */}
            <div className="flex items-center gap-4">
              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-slate-500 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M20.447 20.452H17.21v-5.569c0-1.328-.024-3.037-1.85-3.037-1.851 0-2.135 1.445-2.135 2.939v5.667H9.99V9h3.108v1.561h.044c.433-.82 1.49-1.685 3.066-1.685 3.278 0 3.883 2.157 3.883 4.963v6.613zM5.337 7.433a1.805 1.805 0 1 1 0-3.61 1.805 1.805 0 0 1 0 3.61zm1.604 13.019H3.73V9h3.211v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-slate-500 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── 중단: 네비게이션 컬럼 ── */}
          <div className="grid grid-cols-2 gap-10 border-b border-slate-800 py-12 md:grid-cols-4">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Company</p>
              <ul className="flex flex-col gap-3">
                {["About", "Blog", "Careers", "Press"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 transition hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Product</p>
              <ul className="flex flex-col gap-3">
                {["LOAM AI", "MINARI AI", "FORESTING OS", "Changelog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 transition hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Support</p>
              <ul className="flex flex-col gap-3">
                {["Documentation", "Contact", "Status", "Community"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 transition hover:text-white">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Contact</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li>02-000-0000</li>
                <li>
                  <a href="mailto:contact@bananatech.io" className="transition hover:text-white">
                    contact@bananacompany.ai
                  </a>
                </li>
                <li className="leading-relaxed">
                  서울 마포구 독막로6길 9<br />2층 416호 (합정동)
                </li>
              </ul>
            </div>
          </div>

          {/* ── 하단: 사업자 정보 + 법적 링크 ── */}
          <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-relaxed text-slate-600">
              주식회사 바나나테크놀러지 &nbsp;|&nbsp; 대표 김시원 &nbsp;|&nbsp; 사업자등록번호 218-88-03697
              <br className="md:hidden" />
              <span className="hidden md:inline"> &nbsp;|&nbsp; </span>
              (우) 04072 서울특별시 마포구 독막로6길 9 (합정동) 2층 416호
            </p>
            <div className="flex items-center gap-5 text-xs text-slate-600">
              <a href="#" className="font-semibold transition hover:text-slate-300">개인정보처리방침</a>
              <a href="#" className="transition hover:text-slate-300">이용약관</a>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-700">
            Copyright ⓒ 2026 BananaTechnology. All Rights Reserved.
          </p>

        </div>
      </footer>
    </div>
  );
}
