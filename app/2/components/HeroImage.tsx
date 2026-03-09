"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface HeroImageProps {
  src: string;
  targetSrc: string;
  onSharedImageToggle?: (isActive: boolean) => void;
}

/**
 * Hero → Sticky 이미지 Seamless Transition
 *
 * ─ 구조 ──────────────────────────────────────────────────
 *  placeholderRef  레이아웃 유지용 div (문서 흐름 유지, 스크롤과 함께 이동)
 *  flyingRef       position:fixed div (pin 없이 스크롤 진행도에 따라 뷰포트에서 이동)
 *
 * ─ 핵심 원칙 ─────────────────────────────────────────────
 *  pin: true 사용 금지
 *  → GSAP pin spacer = heroHeight + pinDuration → sticky section을 아래로 밀어
 *    "pin 종료 시점 ≠ sticky 활성화 시점" 순환 의존성 발생
 *
 *  대신 position:fixed 플라잉 이미지 사용
 *  → pin spacer 없음 → getBoundingClientRect() 자연 좌표 = 그대로 정확
 *
 * ─ 스크롤 범위 ────────────────────────────────────────────
 *  startScroll = heroDocTop - 64        (placeholder top = 헤더 아래 64px)
 *  endScroll   = stickyWrapperDocTop - 64  (sticky wrapper top:64px → 활성화)
 *  progress=0: flying = 히어로 이미지 위치/크기
 *  progress=1: flying = sticky 슬롯 위치/크기 (완전 일치 → 즉시 swap 가능)
 */
export default function HeroImage({ src, targetSrc, onSharedImageToggle }: HeroImageProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const placeholderImgRef = useRef<HTMLDivElement>(null);
  const flyingRef = useRef<HTMLDivElement>(null);
  const crossfadeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const placeholder = placeholderRef.current;
    const placeholderImg = placeholderImgRef.current;
    const flying = flyingRef.current;
    const crossfade = crossfadeRef.current;
    const targetEl = document.getElementById("loam-sticky-image");

    if (!placeholder || !placeholderImg || !flying || !crossfade || !targetEl) return;

    const stickyWrapper = targetEl.parentElement; // div.sticky.top-16.pt-10
    if (!stickyWrapper) return;

    const scrollY = window.scrollY;
    const heroRect = placeholder.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const stickyWrapperDocTop = stickyWrapper.getBoundingClientRect().top + scrollY;
    const heroDocTop = heroRect.top + scrollY;

    // ── progress=0 위치: 플레이스홀더가 헤더 아래 64px에 닿는 순간 ──────────
    const fromLeft = heroRect.left;
    const fromTop = 64; // 헤더 높이 = viewport top 기준
    const fromWidth = heroRect.width;
    const fromHeight = heroRect.height;

    // ── progress=1 위치: sticky wrapper 활성화 → #loam-sticky-image top = 64+40=104px ──
    const toLeft = targetRect.left; // 수평 위치 (스크롤과 무관하게 고정)
    const toTop = 104; // 헤더(64) + pt-10(40)
    const toWidth = targetRect.width;
    const toHeight = targetRect.height;

    // pin spacer 없으므로 자연 문서 좌표가 정확
    const scrollRange = Math.max(1, stickyWrapperDocTop - heroDocTop);

    // LOAM AI 섹션(feature index 0)이 "top 35%" 기준으로 활성화되는 스크롤 위치 계산
    // → 이 시점에 morph가 완료되도록 dockProgress를 산출
    const loamTrigger = document.querySelector<HTMLElement>('[data-feature-index="0"]');
    const loamDocTop = loamTrigger
      ? loamTrigger.getBoundingClientRect().top + window.scrollY
      : stickyWrapperDocTop; // fallback
    const dockScroll = loamDocTop - window.innerHeight * 0.35;
    const startScroll = heroDocTop - 64;
    const dockProgress = Math.min(0.99, Math.max(0.01, (dockScroll - startScroll) / scrollRange));

    // 초기 상태 설정
    gsap.set(flying, { top: fromTop, left: fromLeft, width: fromWidth, height: fromHeight, opacity: 0 });
    gsap.set(crossfade, { opacity: 0 });

    // 마운트 시: 첫 번째 sticky 이미지를 숨기고 flying이 시각적 역할 담당
    onSharedImageToggle?.(true);

    // ── 즉시 DOM 조작 헬퍼 (React 상태 업데이트 지연 없이 gap 방지) ────────────

    // progress=1 도달: flying → sticky 이미지 순간 swap
    const swapToSticky = () => {
      gsap.set(flying, { opacity: 0 });
      // 직접 DOM: 첫 번째 feature 이미지 즉시 표시 (React 리렌더 0.5s 지연 방지)
      document.querySelectorAll("[data-feature-img]").forEach((el, i) =>
        gsap.set(el, { opacity: i === 0 ? 1 : 0 }),
      );
      onSharedImageToggle?.(false);
    };

    // 역스크롤: sticky 이미지 → flying 순간 swap
    const swapToFlying = () => {
      document.querySelectorAll("[data-feature-img]").forEach((el) => gsap.set(el, { opacity: 0 }));
      gsap.set(flying, { opacity: 1 });
      onSharedImageToggle?.(true);
    };

    const trigger = ScrollTrigger.create({
      trigger: placeholder,
      start: "top 64px", // placeholder top = 헤더 아래 → 애니메이션 시작
      end: `+=${scrollRange}`, // sticky wrapper 활성화 시점까지
      scrub: true, // lag 없이 scroll에 직결 (lag 있으면 onLeave 시 위치 불일치)
      invalidateOnRefresh: true,

      onEnter: () => {
        // placeholder가 헤더 아래 도달 → flying 활성화, placeholder 이미지 숨김
        gsap.set(placeholderImg, { visibility: "hidden" });
        gsap.set(flying, { opacity: 1, top: fromTop, left: fromLeft, width: fromWidth, height: fromHeight });
        onSharedImageToggle?.(true);
      },

      onLeave: swapToSticky,

      onEnterBack: () => {
        // sticky 구간에서 역스크롤 → flying 복원
        swapToFlying();
        gsap.set(placeholderImg, { visibility: "hidden" });
      },

      onLeaveBack: () => {
        // 히어로 구간 위로 되돌아감 → placeholder 이미지 복원
        gsap.set(flying, { opacity: 0 });
        gsap.set(placeholderImg, { visibility: "visible" });
        onSharedImageToggle?.(false);
      },

      onUpdate: (self) => {
        const p = self.progress;
        // dockProgress 이전: morph 진행 / 이후: target 위치에 고정(sticky가 올라올 때까지 대기)
        const morphP = Math.min(1, p / dockProgress);

        gsap.set(flying, {
          top:    fromTop    + (toTop    - fromTop)    * morphP,
          left:   fromLeft   + (toLeft   - fromLeft)   * morphP,
          width:  fromWidth  + (toWidth  - fromWidth)  * morphP,
          height: fromHeight + (toHeight - fromHeight) * morphP,
        });
        gsap.set(crossfade, { opacity: morphP });
      },
    });

    return () => trigger.kill();
  });

  return (
    <div className="relative">
      {/* ── 레이아웃 유지용 플레이스홀더 ──────────────────────────────────── */}
      {/* 문서 흐름 유지 + flying 활성화 전 실제 이미지 표시 역할 */}
      <div
        ref={placeholderRef}
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{ aspectRatio: "956 / 641" }}
      >
        <div ref={placeholderImgRef} className="absolute inset-0">
          <Image src={src} alt="Hero visual" fill className="object-cover" priority />
        </div>
      </div>

      {/* ── 플라잉 이미지: position:fixed, GSAP pin 없이 스크롤로 직접 제어 ── */}
      {/* z-20: 헤더(z-50) 아래, sticky 콘텐츠(z-10) 위 */}
      <div
        ref={flyingRef}
        className="overflow-hidden rounded-2xl shadow-2xl"
        style={{
          position: "fixed",
          zIndex: 20,
          pointerEvents: "none",
          // 초기값: GSAP이 onEnter 전 올바른 값으로 설정
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          opacity: 0,
        }}
      >
        {/* 베이스: src 이미지 (히어로 이미지) */}
        <Image src={src} alt="" fill className="object-cover" aria-hidden />
        {/* 크로스페이드: scroll 진행도에 따라 targetSrc(LOAM.png)로 전환 */}
        <div ref={crossfadeRef} className="absolute inset-0" style={{ opacity: 0 }}>
          <Image src={targetSrc} alt="" fill className="object-cover" aria-hidden />
        </div>
      </div>
    </div>
  );
}
