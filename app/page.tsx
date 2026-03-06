"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const hintTextRef = useRef<HTMLParagraphElement>(null);
  const endTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const heroWrap = heroWrapRef.current;
    if (!canvas || !heroWrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ImageDecoder API (Chrome 94+) 를 사용해 animated WebP 프레임을 직접 제어
    type ImageDecoderType = {
      tracks: { ready: Promise<void>; selectedTrack: { frameCount: number } };
      decode: (opts: { frameIndex: number }) => Promise<{ image: ImageBitmap & { displayWidth: number; displayHeight: number; close: () => void } }>;
      close: () => void;
    };

    let decoder: ImageDecoderType | null = null;
    let frameCount = 0;
    let lastDrawnFrame = -1;
    let isDecoding = false;

    const loadFrames = async () => {
      try {
        const res = await fetch("/banana.webp");
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // @ts-expect-error — ImageDecoder는 최신 Chrome DOM에 존재하지만 TypeScript lib에 미포함
        decoder = new ImageDecoder({ data: arrayBuffer, type: "image/webp" });
        await decoder!.tracks.ready;

        frameCount = decoder!.tracks.selectedTrack.frameCount;

        // 첫 프레임 미리 그리기
        await drawFrame(0);
      } catch (e) {
        console.warn("ImageDecoder 미지원 환경입니다. Chrome 94+를 사용해 주세요.", e);
      }
    };

    const drawFrame = async (frameIndex: number) => {
      if (!decoder || isDecoding || frameIndex === lastDrawnFrame) return;
      isDecoding = true;
      try {
        const result = await decoder.decode({ frameIndex });
        const img = result.image;
        canvas.width = img.displayWidth;
        canvas.height = img.displayHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img as unknown as CanvasImageSource, 0, 0);
        img.close();
        lastDrawnFrame = frameIndex;
      } catch {
        // 해당 프레임 디코드 실패 시 스킵
      } finally {
        isDecoding = false;
      }
    };

    const syncToScroll = () => {
      if (frameCount === 0) return;

      const heroTop = heroWrap.offsetTop;
      const scrollable = heroWrap.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - heroTop) / scrollable));
      const targetFrame = Math.round(progress * (frameCount - 1));

      drawFrame(targetFrame);

      // "Scroll to peel the banana" — 스크롤 초반 20% 구간에서 페이드아웃
      if (hintTextRef.current) {
        hintTextRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.2));
      }

      // "test" 텍스트 — 스크롤 후반 80~100% 구간에서 페이드인
      if (endTextRef.current) {
        endTextRef.current.style.opacity = String(Math.max(0, (progress - 0.8) / 0.2));
      }
    };

    loadFrames();
    window.addEventListener("scroll", syncToScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncToScroll);
      decoder?.close();
    };
  }, []);

  return (
    <div className="font-sans">
      {/* ================================================================
          HEADER — 고정 내비게이션
      ================================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="text-sm font-semibold tracking-wide text-yellow-400">인투미랩</span>
        <nav>
          <ul className="flex items-center gap-6 text-sm text-gray-700">
            <li>
              <a href="#about" className="transition-colors hover:text-yellow-400">
                About
              </a>
            </li>
            <li>
              <a href="#community" className="transition-colors hover:text-yellow-400">
                Community
              </a>
            </li>
            <li>
              <a href="#ai-agent" className="transition-colors hover:text-yellow-400">
                AI Agent
              </a>
            </li>
            <li>
              <a href="#spaces" className="transition-colors hover:text-yellow-400">
                Spaces
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* ================================================================
            SECTION 1: HERO — 스크롤 드리븐 바나나 애니메이션
            - 300vh 높이로 스크롤 여유 공간 확보
            - sticky로 viewport에 고정된 채 canvas 프레임만 갱신
        ================================================================ */}
        <div ref={heroWrapRef} className="relative h-[300vh]">
          <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
            {/* Canvas: ImageDecoder로 animated WebP 프레임을 직접 렌더링 */}
            <canvas
              ref={canvasRef}
              className="h-[70vh] w-auto max-w-[90vw] object-contain"
            />

            {/* 초기 스크롤 유도 힌트 — 스크롤 시작 시 페이드아웃 */}
            <p
              ref={hintTextRef}
              className="pointer-events-none absolute bottom-10 text-sm tracking-widest text-gray-400 transition-none"
              style={{ opacity: 1 }}
            >
              Scroll to peel the banana ∨
            </p>

            {/* 스크롤 끝 무렵 페이드인되는 텍스트 */}
            <p
              ref={endTextRef}
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold text-gray-900 transition-none md:text-7xl"
              style={{ opacity: 0, display: "flex" }}
            >
              test
            </p>
          </div>
        </div>

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
            SECTION 3: COMMUNITY — 흰 배경, 3열 카드 그리드
        ================================================================ */}
        <section
          id="community"
          className="min-h-screen w-full bg-white px-6 py-24 md:px-12 lg:px-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <p className="mb-2 text-sm tracking-widest text-gray-400">커뮤니티</p>
              <h2 className="text-4xl font-bold text-yellow-400 md:text-5xl">인투미랩</h2>
              <p className="mt-4 text-base text-gray-500 md:text-lg">
                예비창업자와 창업자를 연결하는 실습과 네트워킹 중심 커뮤니티
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { label: "Networking", desc: "예비창업자들이 모여 아이디어를 공유하고 협력합니다" },
                { label: "Workshop", desc: "실전 창업 노하우와 전략을 배우는 교육 프로그램" },
                { label: "Workspace", desc: "창업자들이 함께 일하며 시너지를 만드는 공간" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex flex-col gap-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
                    <span className="absolute bottom-3 left-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-white">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: AI AGENT — 좌·우 레이아웃 + 하단 기능 카드
        ================================================================ */}
        <section
          id="ai-agent"
          className="min-h-screen w-full bg-white px-6 py-24 md:px-12 lg:px-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="mb-6 text-center text-sm tracking-widest text-gray-400">AI Agent</p>

            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              창업 지원을 AI가 직관적으로 돕습니다
            </h2>
            <p className="mt-5 max-w-4xl text-base leading-relaxed text-gray-500 md:text-lg lg:text-xl">
              AI 기반의 맞춤형 지원으로 예비창업자와 창업자가 복잡한 과정을 쉽게 관리할 수 있습니다.
            </p>

            {/* 좌: 텍스트 / 우: 이미지 플레이스홀더 */}
            <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                  AI가 창업 과정을 안내합니다
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-500 md:text-base">
                  맞춤형 계획, 실습 관리, 투자자 연결 등 창업에 필요한 모든 지원을 직관적으로
                  제공합니다.
                </p>
              </div>
              <div className="flex-1">
                <div className="aspect-[4/3] w-full rounded-xl bg-gray-200" />
              </div>
            </div>

            {/* 하단 기능 카드 */}
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {["맞춤형 창업 지원 계획", "투자자 연결 및 지원사업 추천", "실습 진행 관리 및 피드백"].map(
                (text) => (
                  <div key={text} className="rounded-xl bg-gray-100 px-6 py-8 text-center">
                    <p className="font-semibold text-gray-800">{text}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: SPACES — 헤더 텍스트 + 전폭 이미지
        ================================================================ */}
        <section id="spaces" className="min-h-screen w-full bg-white">
          <div className="px-6 py-20 text-center md:px-12">
            <p className="mb-5 text-sm tracking-widest text-gray-400">SPACE</p>
            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              Explore the spaces where startups grow.
            </h2>
          </div>

          {/* 전폭 이미지 플레이스홀더 */}
          <div className="relative aspect-[16/7] w-full bg-gray-300">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-bold text-yellow-400">인투미랩</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              혁신을 만드는 스타트업 파트너. AI 기술과 최적화된 공간으로 당신의 성장을 지원합니다.
            </p>
          </div>
          <nav>
            <ul className="flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:gap-8">
              {["About", "Community", "AI Agent", "Spaces"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="transition-colors hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-gray-800 pt-6">
          <p className="text-center text-xs text-gray-600">© 2026 인투미랩. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
