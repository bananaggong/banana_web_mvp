export default function Home() {
  return (
    <div className="font-sans">
      {/* ================================================================
          HEADER — 고정 내비게이션 (투명 오버레이)
      ================================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="text-sm font-semibold tracking-wide text-white">인투미랩</span>
        <nav>
          <ul className="flex items-center gap-6 text-sm text-white/70">
            <li>
              <a href="#about" className="transition-colors hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="#community" className="transition-colors hover:text-white">
                Community
              </a>
            </li>
            <li>
              <a href="#ai-agent" className="transition-colors hover:text-white">
                AI Agent
              </a>
            </li>
            <li>
              <a href="#spaces" className="transition-colors hover:text-white">
                Spaces
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* ================================================================
            SECTION 1: HERO — 전체화면 어두운 배경 + 인물 이미지 자리
        ================================================================ */}
        <section
          id="hero"
          className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-900"
        >
          {/* 배경 이미지 자리 (인물 사진) */}
          <div className="absolute inset-0 bg-gray-700 opacity-60" />

          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

          {/* 히어로 카피 */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              혁신을 만드는 스타트업 파트너
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/90 md:text-2xl lg:text-3xl">
              AI 기술과 최적화된 공간으로 당신의 비즈니스 성장을 지원합니다
            </p>
            <button className="mt-2 text-xl font-medium text-white underline underline-offset-8 transition-opacity hover:opacity-60">
              시작하기
            </button>
          </div>

          {/* 스크롤 힌트 */}
          <div className="absolute bottom-10 z-10 flex flex-col items-center gap-1">
            <p className="text-sm tracking-widest text-white/50">Scroll to peel the banana ∨</p>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: ABOUT — 노란 배경 전체화면
        ================================================================ */}
        <section
          id="about"
          className="flex min-h-screen w-full items-center justify-center bg-yellow-400 px-6 py-24 md:px-16 lg:px-32"
        >
          <div className="max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-snug text-white md:text-4xl lg:text-5xl">
              우리는 창업 과정을 쉽고 직관적으로 만들어 누구나 도전할 수 있는 환경을 제공합니다.
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/80 md:text-base lg:text-lg">
              예비창업자 커뮤니티, AI 지원 프로그램, 맞춤형 비즈니스 공간을 통해 창업의 모든 과정을
              단순화하고, 지속 가능한 성장을 돕습니다.
            </p>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: COMMUNITY — 흰 배경, 노란 타이틀, 3열 카드
        ================================================================ */}
        <section
          id="community"
          className="min-h-screen w-full bg-white px-6 py-24 md:px-12 lg:px-20"
        >
          <div className="mx-auto max-w-6xl">
            {/* 섹션 헤더 */}
            <div className="mb-14 text-center">
              <p className="mb-2 text-sm tracking-widest text-gray-400">커뮤니티</p>
              <h2 className="text-4xl font-bold text-yellow-400 md:text-5xl">인투미랩</h2>
              <p className="mt-4 text-base text-gray-500 md:text-lg">
                예비창업자와 창업자를 연결하는 실습과 네트워킹 중심 커뮤니티
              </p>
            </div>

            {/* 3열 이미지 카드 그리드 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* 카드 1 — Networking */}
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
                  <span className="absolute bottom-3 left-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-white">
                    Networking
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  예비창업자들이 모여 아이디어를 공유하고 협력합니다
                </p>
              </div>

              {/* 카드 2 — Workshop */}
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
                  <span className="absolute bottom-3 left-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-white">
                    Workshop
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  실전 창업 노하우와 전략을 배우는 교육 프로그램
                </p>
              </div>

              {/* 카드 3 — Workspace */}
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
                  <span className="absolute bottom-3 left-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-white">
                    Workspace
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  창업자들이 함께 일하며 시너지를 만드는 공간
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: AI AGENT — 흰 배경, 좌·우 레이아웃 + 기능 카드
        ================================================================ */}
        <section
          id="ai-agent"
          className="min-h-screen w-full bg-white px-6 py-24 md:px-12 lg:px-20"
        >
          <div className="mx-auto max-w-6xl">
            {/* 섹션 레이블 */}
            <p className="mb-6 text-center text-sm tracking-widest text-gray-400">AI Agent</p>

            {/* 섹션 메인 헤딩 */}
            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              창업 지원을 AI가 직관적으로 돕습니다
            </h2>
            <p className="mt-5 max-w-4xl text-base leading-relaxed text-gray-500 md:text-lg lg:text-xl">
              AI 기반의 맞춤형 지원으로 예비창업자와 창업자가 복잡한 과정을 쉽게 관리할 수 있습니다.
            </p>

            {/* 좌: 텍스트 / 우: 이미지 */}
            <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                  AI가 창업 과정을 안내합니다
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-500 md:text-base">
                  맞춤형 계획, 실습 관리, 투자자 연결 등 창업에 필요한 모든 지원을 직관적으로 제공합니다.
                </p>
              </div>

              {/* 이미지 자리 (빈티지 컨트롤 패널) */}
              <div className="flex-1">
                <div className="aspect-[4/3] w-full rounded-xl bg-gray-200" />
              </div>
            </div>

            {/* 하단 기능 카드 3개 */}
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-gray-100 px-6 py-8 text-center">
                <p className="font-semibold text-gray-800">맞춤형 창업 지원 계획</p>
              </div>
              <div className="rounded-xl bg-gray-100 px-6 py-8 text-center">
                <p className="font-semibold text-gray-800">투자자 연결 및 지원사업 추천</p>
              </div>
              <div className="rounded-xl bg-gray-100 px-6 py-8 text-center">
                <p className="font-semibold text-gray-800">실습 진행 관리 및 피드백</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: SPACES — 흰 배경 헤더 + 전폭 이미지
        ================================================================ */}
        <section id="spaces" className="min-h-screen w-full bg-white">
          {/* 섹션 헤더 텍스트 */}
          <div className="px-6 py-20 text-center md:px-12">
            <p className="mb-5 text-sm tracking-widest text-gray-400">SPACE</p>
            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              Explore the spaces where startups grow.
            </h2>
          </div>

          {/* 전폭 이미지 자리 (컨퍼런스룸) */}
          <div className="relative w-full bg-gray-300" style={{ aspectRatio: "16/7" }}>
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
              <h3 className="text-xl font-bold text-white md:text-2xl lg:text-3xl">
                GYOWOO LOUNGE
              </h3>
              <p className="mt-2 text-sm text-white/80 md:text-base">
                Premium event space for community gatherings and networking.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================
          FOOTER — 검정 배경
      ================================================================ */}
      <footer className="bg-black px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* 로고 & 설명 */}
          <div>
            <p className="text-lg font-bold text-yellow-400">인투미랩</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              혁신을 만드는 스타트업 파트너. AI 기술과 최적화된 공간으로 당신의 성장을 지원합니다.
            </p>
          </div>

          {/* 내비게이션 링크 */}
          <nav>
            <ul className="flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:gap-8">
              <li>
                <a href="#about" className="transition-colors hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#community" className="transition-colors hover:text-white">
                  Community
                </a>
              </li>
              <li>
                <a href="#ai-agent" className="transition-colors hover:text-white">
                  AI Agent
                </a>
              </li>
              <li>
                <a href="#spaces" className="transition-colors hover:text-white">
                  Spaces
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* 카피라이트 */}
        <div className="mx-auto mt-12 max-w-6xl border-t border-gray-800 pt-6">
          <p className="text-center text-xs text-gray-600">
            © 2026 인투미랩. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
