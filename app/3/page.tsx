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
          Banana Technology
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
          className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-24 md:px-16 lg:px-32"
        >
          <div className="max-w-4xl text-center">
            <h2
              className="text-4xl font-bold leading-tight md:text-5xl lg:text-[48px]"
              style={{ color: "#FEDD00" }}
            >
              우리는 창업 과정을 쉽고 직관적으로 만들어 누구나 도전할 수 있는 환경을 제공합니다.
            </h2>
            <p className="mt-10 text-xl leading-relaxed md:text-2xl" style={{ color: "#FEDD00" }}>
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
            {/* 섹션 헤더 */}
            <div className="mb-12">
              <p className="mb-6 text-xl font-medium" style={{ color: "#555555" }}>
                커뮤니티
              </p>
              <h2 className="text-center text-4xl font-bold md:text-5xl" style={{ color: "#222222" }}>
                인투미랩
              </h2>
              <p className="mt-4 text-center text-2xl" style={{ color: "#555555" }}>
                예비창업자와 창업자를 연결하는 실습과 네트워킹 중심 커뮤니티
              </p>
            </div>

            {/* 5개 카드 그리드 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[
                { label: "Networking", desc: "예비창업자들이 모여 아이디어를 공유하고 협력합니다" },
                { label: "Workshop",   desc: "실전 창업 노하우와 전략을 배우는 교육 프로그램" },
                { label: "Workspace",  desc: "창업자들이 함께 일하며 시너지를 만드는 공간" },
                { label: "Pitching",   desc: "투자자 앞에서 아이디어를 발표하는 기회" },
                { label: "Mentoring",  desc: "경험 많은 전문가들의 1:1 맞춤형 조언" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex flex-col gap-3">
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200"
                    style={{ boxShadow: "0 4px 6px -4px rgba(0,0,0,0.10), 0 10px 15px -3px rgba(0,0,0,0.10)" }}
                  >
                    <span
                      className="absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-sm font-bold"
                      style={{ backgroundColor: "#FEDD00", color: "#0085CA" }}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-base font-medium" style={{ color: "#222222" }}>
                    {desc}
                  </p>
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
            <div className="text-center">
              <p className="mb-4 text-[27px] font-medium" style={{ color: "#555555" }}>
                AI Agent
              </p>
              <h2 className="text-5xl font-bold leading-tight md:text-6xl lg:text-[64px]" style={{ color: "#222222" }}>
                창업 지원을 AI가 직관적으로 돕습니다
              </h2>
              <p className="mt-6 text-2xl leading-relaxed md:text-3xl" style={{ color: "#555555" }}>
                AI 기반의 맞춤형 지원으로 예비창업자와 창업자가 복잡한 과정을 쉽게 관리할 수 있습니다.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl">
              <div
                className="aspect-[600/350] w-full rounded-xl bg-gray-200"
                style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
              />
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-10">
              {["맞춤형 창업 지원 계획", "투자자 연결 및 지원사업 추천", "실습 진행 관리 및 피드백"].map((text) => (
                <div key={text} className="rounded-xl bg-gray-100 px-8 py-6 text-center">
                  <p className="text-[27px] font-medium" style={{ color: "#222222" }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: SPACES — 헤더 + 5개 전폭 공간 카드
        ================================================================ */}
        <section id="spaces" className="w-full bg-white">
          <div className="px-6 py-20 text-center md:px-12">
            <p className="mb-4 text-[27px] font-medium" style={{ color: "#555555" }}>
              SPACE
            </p>
            <h2 className="text-5xl font-bold leading-tight md:text-6xl lg:text-[64px]" style={{ color: "#222222" }}>
              Explore the spaces where startups grow.
            </h2>
          </div>

          <div className="flex flex-col gap-[100px]">
            {[
              { name: "GYOWOO LOUNGE", desc: "Premium event space for community gatherings and networking.", bg: "bg-gray-400" },
              { name: "WORK CAFE", desc: "Open collaborative workspace designed for founders and creators.", bg: "bg-stone-700" },
              { name: "CREATIVE STUDIO", desc: "Professional media production space for content and branding.", bg: "bg-neutral-800" },
              { name: "GYOWOO OFFICE", desc: "Private offices and meeting rooms for focused work.", bg: "bg-slate-800" },
              { name: "SKY DECK", desc: "Rooftop networking and relaxation space with city views.", bg: "bg-gradient-to-b from-gray-200 to-gray-500" },
            ].map(({ name, desc, bg }) => (
              <div key={name} className={`relative h-[560px] w-full ${bg}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-8 md:left-[120px]">
                  <h3 className="text-[48px] font-bold leading-[72px] text-white">{name}</h3>
                  <p className="mt-1 max-w-xl text-[27px] leading-[40px] text-white/90">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            우리의 서비스 섹션
        ================================================================ */}
        <section className="w-full bg-white px-6 py-20 md:px-8 lg:px-[120px]">
          <div className="mb-12 text-center">
            <h2 className="text-[36px] font-bold leading-[40px]" style={{ color: "#101828" }}>
              우리의 서비스
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#4A5565" }}>
              성공적인 비즈니스를 위한 맞춤형 솔루션을 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: "AI 컨설팅", desc: "최신 AI 기술을 활용한 맞춤형 컨설팅으로 비즈니스의 디지털 전환을 성공적으로 이끌어냅니다." },
              { title: "공간 대여", desc: "창의적인 업무 환경을 위한 최적화된 공간을 제공합니다. 유연한 대여 옵션으로 비즈니스 요구에 맞춰 선택하세요." },
              { title: "비즈니스 지원", desc: "전문 컨설턴트와 함께 전략 수립부터 실행까지, 스타트업의 성장 단계별로 필요한 지원을 제공합니다." },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-xl bg-white p-6"
                style={{ boxShadow: "0 4px 6px -4px rgba(0,0,0,0.10), 0 10px 15px -3px rgba(0,0,0,0.10)" }}
              >
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-200" />
                <h3 className="text-2xl font-semibold" style={{ color: "#101828" }}>{title}</h3>
                <p className="text-base leading-[26px]" style={{ color: "#4A5565" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            CTA 섹션
        ================================================================ */}
        <section
          className="flex min-h-[800px] w-full flex-col items-center justify-center px-6 py-20 text-center"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-[36px] font-bold leading-[40px]" style={{ color: "#101828" }}>
            함께 성장할 준비가 되셨나요?
          </h2>
          <a href="#" className="mt-6 text-xl transition-colors hover:opacity-70" style={{ color: "#4A5565" }}>
            문의하기
          </a>
        </section>
      </main>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer
        className="w-full border-t px-6 py-[49px] md:px-[120px]"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <p className="text-[14.67px]" style={{ color: "#6A7282" }}>
            © 2026 GYOWOO
          </p>
          <nav>
            <ul className="flex items-center gap-8 text-[14.67px]" style={{ color: "#6A7282" }}>
              {[
                { label: "Instagram", href: "#" },
                { label: "LinkedIn",  href: "#" },
                { label: "Contact",   href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="transition-opacity hover:opacity-60">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
