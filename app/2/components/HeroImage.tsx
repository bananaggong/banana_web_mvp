"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface HeroImageProps {
  src: string;
  images: string[];
  activeIndex: number;
}

/**
 * Hero → Sticky 이미지 Seamless Transition
 *
 * ─ 구조 ──────────────────────────────────────────────────
 *  placeholderRef  레이아웃 유지용 div (문서 흐름 유지, 스크롤과 함께 이동)
 *  flyingRef       position:fixed div (pin 없이 스크롤 진행도에 따라 뷰포트에서 이동)
 *
 * ─ 스크롤 범위 ────────────────────────────────────────────
 *  Morph trigger  : hero top → sticky wrapper 활성화 시점
 *                   flying이 hero 위치에서 ghost anchor 위치로 이동/축소
 *  Exit trigger   : #features-section bottom → 뷰포트 하단 통과 시 fade out
 *
 * ─ 이미지 전환 ────────────────────────────────────────────
 *  dock 전   : src(히어로) → images[0] crossfade (scroll progress 기반)
 *  dock 후   : activeIndex 변경 시 images[activeIndex] crossfade
 */
export default function HeroImage({ src, images, activeIndex }: HeroImageProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const placeholderImgRef = useRef<HTMLDivElement>(null);
  const flyingRef = useRef<HTMLDivElement>(null);
  // hero base image opacity (morph 중 0으로)
  const heroLayerRef = useRef<HTMLDivElement>(null);
  // feature images wrapper opacity (morph 중 1로)
  const featureWrapperRef = useRef<HTMLDivElement>(null);
  // 각 feature 이미지 레이어 refs
  const featureImgRefs = useRef<(HTMLDivElement | null)[]>([]);
  featureImgRefs.current.length = images.length;

  // dock 상태 추적 (GSAP trigger 내에서 설정)
  const isDocked = useRef(false);

  // ── Morph + exit ScrollTrigger 설정 (마운트 시 1회) ───────────────────
  useGSAP(() => {
    const placeholder = placeholderRef.current;
    const placeholderImg = placeholderImgRef.current;
    const flying = flyingRef.current;
    const heroLayer = heroLayerRef.current;
    const featureWrapper = featureWrapperRef.current;
    const targetEl = document.getElementById("loam-sticky-image");
    const featuresSection = document.getElementById("features-section");

    if (!placeholder || !placeholderImg || !flying || !heroLayer || !featureWrapper || !targetEl) return;

    const stickyWrapper = targetEl.parentElement;
    if (!stickyWrapper) return;

    const scrollY = window.scrollY;
    const heroRect = placeholder.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const stickyWrapperDocTop = stickyWrapper.getBoundingClientRect().top + scrollY;
    const heroDocTop = heroRect.top + scrollY;

    const fromLeft = heroRect.left;
    const fromTop = 64;
    const fromWidth = heroRect.width;
    const fromHeight = heroRect.height;

    const toLeft = targetRect.left;
    const toTop = 104; // 헤더(64) + pt-10(40)
    const toWidth = targetRect.width;
    const toHeight = targetRect.height;

    const scrollRange = Math.max(1, stickyWrapperDocTop - heroDocTop);

    // LOAM AI 섹션이 "top 35%" 기준으로 활성화되는 스크롤 위치 → morph 완료 시점
    const loamTrigger = document.querySelector<HTMLElement>('[data-feature-index="0"]');
    const loamDocTop = loamTrigger
      ? loamTrigger.getBoundingClientRect().top + window.scrollY
      : stickyWrapperDocTop;
    const dockScroll = loamDocTop - window.innerHeight * 0.35;
    const startScroll = heroDocTop - 64;
    const dockProgress = Math.min(0.99, Math.max(0.01, (dockScroll - startScroll) / scrollRange));

    // 초기 상태
    gsap.set(flying, { top: fromTop, left: fromLeft, width: fromWidth, height: fromHeight, opacity: 0 });
    gsap.set(heroLayer, { opacity: 1 });
    gsap.set(featureWrapper, { opacity: 0 });
    featureImgRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0 });
    });

    const swapToFlying = () => {
      isDocked.current = false;
      gsap.set(flying, { opacity: 1 });
      gsap.set(placeholderImg, { visibility: "hidden" });
    };

    const morphTrigger = ScrollTrigger.create({
      trigger: placeholder,
      start: "top 64px",
      end: `+=${scrollRange}`,
      scrub: true,
      invalidateOnRefresh: true,

      onEnter: () => {
        gsap.set(placeholderImg, { visibility: "hidden" });
        gsap.set(flying, { opacity: 1, top: fromTop, left: fromLeft, width: fromWidth, height: fromHeight });
      },

      onLeave: () => {
        // dock 완료: flying을 dock 위치에 고정, sticky 이미지로 넘기지 않고 유지
        isDocked.current = true;
        gsap.set(flying, {
          top: toTop,
          left: toLeft,
          width: toWidth,
          height: toHeight,
          opacity: 1,
        });
      },

      onEnterBack: () => {
        swapToFlying();
      },

      onLeaveBack: () => {
        isDocked.current = false;
        gsap.set(flying, { opacity: 0 });
        gsap.set(placeholderImg, { visibility: "visible" });
      },

      onUpdate: (self) => {
        const p = self.progress;
        const morphP = Math.min(1, p / dockProgress);

        gsap.set(flying, {
          top:    fromTop    + (toTop    - fromTop)    * morphP,
          left:   fromLeft   + (toLeft   - fromLeft)   * morphP,
          width:  fromWidth  + (toWidth  - fromWidth)  * morphP,
          height: fromHeight + (toHeight - fromHeight) * morphP,
        });
        gsap.set(heroLayer, { opacity: 1 - morphP });
        gsap.set(featureWrapper, { opacity: morphP });
      },
    });

    // features section이 뷰포트 하단을 벗어날 때 flying fade out
    let exitTrigger: ScrollTrigger | null = null;
    if (featuresSection) {
      exitTrigger = ScrollTrigger.create({
        trigger: featuresSection,
        start: "bottom bottom",
        onLeave: () => {
          gsap.to(flying, { opacity: 0, duration: 0.3 });
        },
        onEnterBack: () => {
          if (isDocked.current) {
            gsap.to(flying, { opacity: 1, duration: 0.3 });
          }
        },
      });
    }

    return () => {
      morphTrigger.kill();
      exitTrigger?.kill();
    };
  });

  // ── activeIndex 변경 시 feature 이미지 crossfade (dock 상태일 때만) ─────
  useGSAP(
    () => {
      if (!isDocked.current) return;
      featureImgRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          opacity: i === activeIndex ? 1 : 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      });
    },
    { dependencies: [activeIndex] },
  );

  return (
    <div className="relative">
      {/* ── 레이아웃 유지용 플레이스홀더 ──────────────────────────────────── */}
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
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          opacity: 0,
        }}
      >
        {/* 히어로 베이스 이미지: morph 중 fade out */}
        <div ref={heroLayerRef} className="absolute inset-0">
          <Image src={src} alt="" fill className="object-cover" aria-hidden />
        </div>

        {/* Feature 이미지 레이어들: morph 중 fade in, dock 후 activeIndex 기반 전환 */}
        <div ref={featureWrapperRef} className="absolute inset-0" style={{ opacity: 0 }}>
          {images.map((imgSrc, i) => (
            <div
              key={i}
              ref={(el) => { featureImgRefs.current[i] = el; }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image src={imgSrc} alt="" fill className="object-cover" aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
