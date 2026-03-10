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

export default function HeroImage({ src, images, activeIndex }: HeroImageProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const placeholderImgRef = useRef<HTMLDivElement>(null);
  const flyingRef = useRef<HTMLDivElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const featureWrapperRef = useRef<HTMLDivElement>(null);
  const featureImgRefs = useRef<(HTMLDivElement | null)[]>([]);
  featureImgRefs.current.length = images.length;

  const isDocked = useRef(false);
  const dockScrollY = useRef(0);

  // dock 후 scroll tracking을 위한 refs (두 useGSAP 블록 간 공유)
  const toTopRef = useRef(0);
  const scrollListenerRef = useRef<(() => void) | null>(null);
  const scrollTrackActiveRef = useRef(false);

  // ── Morph ScrollTrigger (마운트 시 1회) ─────────────────────────────────
  useGSAP(() => {
    const placeholder = placeholderRef.current;
    const placeholderImg = placeholderImgRef.current;
    const flying = flyingRef.current;
    const heroLayer = heroLayerRef.current;
    const featureWrapper = featureWrapperRef.current;
    const targetEl = document.getElementById("loam-sticky-image");

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

    // 다른 useGSAP 블록에서도 접근 가능하도록 ref에 저장
    toTopRef.current = toTop;

    const scrollRange = Math.max(1, stickyWrapperDocTop - heroDocTop);

    const loamTrigger = document.querySelector<HTMLElement>('[data-feature-index="0"]');
    const loamDocTop = loamTrigger
      ? loamTrigger.getBoundingClientRect().top + window.scrollY
      : stickyWrapperDocTop;
    const dockScroll = loamDocTop - window.innerHeight * 0.50;
    const startScroll = heroDocTop - 64;
    const dockProgress = Math.min(0.99, Math.max(0.01, (dockScroll - startScroll) / scrollRange));

    // 초기 상태
    gsap.set(flying, { top: fromTop, left: fromLeft, width: fromWidth, height: fromHeight, opacity: 0 });
    gsap.set(heroLayer, { opacity: 1 });
    gsap.set(featureWrapper, { opacity: 0 });
    featureImgRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0 });
    });

    // FORESTING OS 활성화 시 시작할 scroll tracking 함수 (ref에 저장해 두 블록 간 공유)
    const trackDocumentScroll = () => {
      const delta = window.scrollY - dockScrollY.current;
      gsap.set(flying, { top: toTopRef.current - delta });
    };
    scrollListenerRef.current = trackDocumentScroll;

    const stopScrollTracking = () => {
      if (scrollTrackActiveRef.current && scrollListenerRef.current) {
        window.removeEventListener("scroll", scrollListenerRef.current);
        scrollTrackActiveRef.current = false;
      }
    };

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
        // dock 완료: 이미지를 dock 위치에 고정
        // scroll tracking은 FORESTING OS 활성화 시 시작 (아직 시작 안 함)
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
        stopScrollTracking();
        gsap.set(flying, { top: toTop });
        swapToFlying();
      },

      onLeaveBack: () => {
        isDocked.current = false;
        stopScrollTracking();
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

    return () => {
      morphTrigger.kill();
      stopScrollTracking();
    };
  });

  // ── activeIndex 변경 시: 이미지 crossfade + scroll tracking 시작/중지 ────
  useGSAP(
    () => {
      const flying = flyingRef.current;
      const lastIndex = images.length - 1;

      // FORESTING OS 활성화: scroll tracking 시작
      if (activeIndex === lastIndex && isDocked.current && !scrollTrackActiveRef.current) {
        dockScrollY.current = window.scrollY;
        scrollTrackActiveRef.current = true;
        if (scrollListenerRef.current) {
          window.addEventListener("scroll", scrollListenerRef.current, { passive: true });
        }
      }

      // FORESTING OS 이전으로 역스크롤: scroll tracking 중지 + top 원복
      if (activeIndex < lastIndex && scrollTrackActiveRef.current) {
        if (scrollListenerRef.current) {
          window.removeEventListener("scroll", scrollListenerRef.current);
        }
        scrollTrackActiveRef.current = false;
        if (flying) gsap.set(flying, { top: toTopRef.current });
      }

      // 이미지 crossfade (dock 상태일 때만)
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

      {/* ── 플라잉 이미지: position:fixed, z-20 (헤더 z-50 아래, 다음 섹션 z-30 아래) ── */}
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

        {/* Feature 이미지 레이어들: morph 중 fade in, activeIndex 기반 전환 */}
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
