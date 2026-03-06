"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const heroWrapRef  = useRef<HTMLDivElement>(null);
  const hintTextRef  = useRef<HTMLParagraphElement>(null);
  const endTextRef   = useRef<HTMLParagraphElement>(null);
  const hintSpanRef  = useRef<HTMLSpanElement>(null);
  const endSpanRef   = useRef<HTMLSpanElement>(null);

  // 헤더 동적 색상 제어용 refs
  const logoRef         = useRef<HTMLSpanElement>(null);
  const navAboutRef     = useRef<HTMLAnchorElement>(null);
  const navCommunityRef = useRef<HTMLAnchorElement>(null);
  const navAiAgentRef   = useRef<HTMLAnchorElement>(null);
  const navSpacesRef    = useRef<HTMLAnchorElement>(null);

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
      const targetFrame = Math.round(progress * Math.floor(frameCount * 0.9));

      drawFrame(targetFrame);

      // "Scroll to peel the banana" — 초반 20% 페이드아웃, 완전할 때 span blink 켜짐
      if (hintTextRef.current && hintSpanRef.current) {
        const hintOpacity = Math.max(0, 1 - progress / 0.2);
        hintTextRef.current.style.opacity = String(hintOpacity);
        hintSpanRef.current.style.animationPlayState =
          hintOpacity >= 0.99 ? "running" : "paused";
      }

      // "Scroll to Feel the BANANA" — 60~80% 페이드인, 완전할 때 span blink 켜짐
      if (endTextRef.current && endSpanRef.current) {
        const endOpacity = Math.max(0, (progress - 0.6) / 0.2);
        endTextRef.current.style.opacity = String(endOpacity);
        endSpanRef.current.style.animationPlayState =
          endOpacity >= 0.99 ? "running" : "paused";
      }
    };

    loadFrames();
    window.addEventListener("scroll", syncToScroll, { passive: true });

    // ── 섹션별 헤더 색상 제어 ──────────────────────────────────────────
    const updateHeader = (activeId: string, isDark: boolean) => {
      const BLUE   = "#3b82f6";
      const WHITE  = "#ffffff";
      const W_MUTE = "rgba(255,255,255,0.70)";
      const YELLOW = "#facc15";
      const GRAY   = "#6b7280";

      if (logoRef.current)
        logoRef.current.style.color = isDark ? WHITE : YELLOW;

      const links: [React.RefObject<HTMLAnchorElement | null>, string][] = [
        [navAboutRef,     "about"],
        [navCommunityRef, "community"],
        [navAiAgentRef,   "ai-agent"],
        [navSpacesRef,    "spaces"],
      ];
      links.forEach(([ref, id]) => {
        if (!ref.current) return;
        ref.current.style.color =
          id === activeId ? BLUE : isDark ? W_MUTE : GRAY;
      });
    };

    // 초기 상태: 히어로 (흰색 헤더, 활성 없음)
    updateHeader("", true);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const isDark = id === "hero" || id === "about";
          updateHeader(id, isDark);
        });
      },
      { threshold: 0.3 },
    );

    const observeIds = ["hero", "about", "community", "ai-agent", "spaces"];
    observeIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
    // ──────────────────────────────────────────────────────────────────

    return () => {
      window.removeEventListener("scroll", syncToScroll);
      decoder?.close();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="font-sans">
      {/* ================================================================
          HEADER — 고정 내비게이션
      ================================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 md:px-12">
        <span
          ref={logoRef}
          className="text-sm font-semibold tracking-wide transition-colors duration-300"
          style={{ color: "#ffffff" }}
        >
          인투미랩
        </span>
        <nav>
          <ul className="flex items-center gap-8 text-sm">
            <li>
              <a
                ref={navAboutRef}
                href="#about"
                className="transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
                About
              </a>
            </li>
            <li>
              <a
                ref={navCommunityRef}
                href="#community"
                className="transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
                Community
              </a>
            </li>
            <li>
              <a
                ref={navAiAgentRef}
                href="#ai-agent"
                className="transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
                AI Agent
              </a>
            </li>
            <li>
              <a
                ref={navSpacesRef}
                href="#spaces"
                className="transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
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
        <div id="hero" ref={heroWrapRef} className="relative h-[300vh]">
          <div className="sticky top-0 h-screen w-full relative overflow-hidden bg-white">
            {/* Canvas: absolute inset-0으로 뷰포트 전체 채움 */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
            />

            {/* 초기 힌트 텍스트 — 외부 p: 페이드 / 내부 span: 글자 깜빡임 */}
            <p
              ref={hintTextRef}
              className="pointer-events-none absolute inset-0 flex items-center justify-center transition-none"
              style={{ opacity: 1 }}
            >
              <span
                ref={hintSpanRef}
                className="text-5xl font-bold text-gray-400 md:text-7xl"
                style={{
                  animation: "glow-blink 2.5s ease-in-out infinite",
                  animationPlayState: "running",
                }}
              >
                Scroll to peel the banana ∨
              </span>
            </p>

            {/* 엔딩 텍스트 — 외부 p: 페이드 / 내부 span: 글자 깜빡임 */}
            <p
              ref={endTextRef}
              className="pointer-events-none absolute inset-0 flex items-center justify-center transition-none"
              style={{ opacity: 0 }}
            >
              <span
                ref={endSpanRef}
                className="text-5xl font-bold text-gray-900 md:text-7xl"
                style={{
                  animation: "glow-blink 2.5s ease-in-out infinite",
                  animationPlayState: "paused",
                }}
              >
                Scroll to Feel the BANANA
              </span>
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
              <p className="mb-2 text-left text-4xl tracking-widest text-gray-400 md:text-5xl">Community</p>
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
            <p className="mb-6 text-left text-4xl tracking-widest text-gray-400 md:text-5xl">AI Agent</p>

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
            SECTION 5: SPACES — 헤더 + 5개 전폭 공간 카드
        ================================================================ */}
        <section id="spaces" className="w-full bg-white">
          {/* 섹션 헤더 */}
          <div className="px-6 py-20 text-center md:px-12">
            <p className="mb-5 text-left text-4xl tracking-widest text-gray-400 md:text-5xl">SPACE</p>
            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              Explore the spaces where startups grow.
            </h2>
          </div>

          {/* 공간 목록 — 카드 높이 50vh, 카드 사이 백색 간격 */}
          <div className="flex flex-col gap-36">
            {[
              {
                name: "GYOWOO LOUNGE",
                desc: "Premium event space for community gatherings and networking.",
                bg: "bg-gray-400",
                overlay: "bg-black/30",
              },
              {
                name: "WORK CAFE",
                desc: "Open collaborative workspace designed for founders and creators.",
                bg: "bg-stone-700",
                overlay: "bg-black/40",
              },
              {
                name: "CREATIVE STUDIO",
                desc: "Professional media production space for content and branding.",
                bg: "bg-neutral-800",
                overlay: "bg-black/35",
              },
              {
                name: "GYOWOO OFFICE",
                desc: "Private offices and meeting rooms for focused work.",
                bg: "bg-slate-800",
                overlay: "bg-black/40",
              },
              {
                name: "SKY DECK",
                desc: "Rooftop networking and relaxation space with city views.",
                bg: "bg-gradient-to-b from-gray-200 to-gray-500",
                overlay: "bg-black/10",
              },
            ].map(({ name, desc, bg, overlay }) => (
              <div key={name} className={`relative h-[50vh] w-full ${bg}`}>
                <div className={`absolute inset-0 ${overlay}`} />
                <div className="absolute bottom-8 left-8 md:bottom-10 md:left-12">
                  <h3 className="text-xl font-bold text-white md:text-2xl">{name}</h3>
                  <p className="mt-2 max-w-xs text-sm text-white/80 md:text-base">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            CTA 섹션 — "함께 성장할 준비가 되셨나요?"
        ================================================================ */}
        <section className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50 to-gray-100 px-6 py-32 text-center">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl">
            함께 성장할 준비가 되셨나요?
          </h2>
          <a
            href="#"
            className="mt-6 text-sm text-gray-400 underline underline-offset-4 transition-colors hover:text-gray-700"
          >
            문의하기
          </a>
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
