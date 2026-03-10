"use client";

import { Fragment, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: number;
  slideText: string;
  title: string;
  description: string[];
  imgUrl: string;
}

const FEATURES: Feature[] = [
  {
    id: 1,
    slideText: "LOAM AI",
    title: "Analyze status, score market fit",
    description: [
      "사업 및 프로젝트 구조 진단",
      "시장 적합성 분석",
      "실행 우선순위 도출",
      "전략 리포트 생성",
    ],
    imgUrl: "/LOAM.png",
  },
  {
    id: 2,
    slideText: "MINARI AI",
    title: "Build agents, workflows",
    description: [
      "업무 흐름 구조화",
      "일정 및 과업 정리",
      "의사결정 지원",
      "개인 작업 패턴 기반 추천 시스템",
    ],
    imgUrl: "/MINARI.png",
  },
  {
    id: 3,
    slideText: "FORESTING OS",
    title: "Transform raw data",
    description: [
      "전략 설계",
      "실행 관리",
      "프로젝트 흐름 통합",
      "AI 기반 운영 지원",
    ],
    imgUrl: "/FORESTING.png",
  },
];

const SLOT_ITEM_HEIGHT = 56;
const LAST_INDEX = FEATURES.length - 1;

export default function StickyScrollFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef      = useRef<HTMLDivElement>(null);
  const triggerRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef         = useRef<HTMLDivElement>(null);
  const imageRefs         = useRef<(HTMLDivElement | null)[]>([]);
  const slotHeaderRef     = useRef<HTMLDivElement>(null);
  const rightStickyRef    = useRef<HTMLDivElement>(null);
  const lastCardSpacerRef = useRef<HTMLDivElement>(null);
  const pinSentinelRef    = useRef<HTMLDivElement>(null);

  triggerRefs.current.length = FEATURES.length;
  imageRefs.current.length   = FEATURES.length;

  const safeIndex = Math.min(activeIndex, FEATURES.length - 1);

  useGSAP(
    () => {
      // ── pin 상태 ───────────────────────────────────────────────────────────
      let docked      = false;
      let dockScrollY = 0;
      const pinned = {
        cardTop: 0, cardLeft: 0, cardWidth: 0,
        headerLeft: 0, headerWidth: 0,
        imageTop: 0, imageLeft: 0, imageWidth: 0,
      };

      let rafId = 0;

      const trackScroll = () => {
        if (!docked) return;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (!docked) return;
          // 역스크롤로 dock 지점보다 충분히 위로 올라왔을 때 unpin
          // GSAP 스케줄러 지연 없이 여기서 처리해야 점프가 없음
          // 10px 여유(hysteresis): 핀 직후 scrollY == dockScrollY 상태에서 즉시 해제되는 것을 방지
          if (window.scrollY < dockScrollY - 10) {
            unpinLastCard();
            return;
          }
          const delta  = Math.max(0, window.scrollY - dockScrollY);
          const card   = triggerRefs.current[LAST_INDEX];
          const header = slotHeaderRef.current;
          const img    = rightStickyRef.current;
          if (card)   gsap.set(card,   { top: pinned.cardTop   - delta });
          if (header) gsap.set(header, { top: 64               - delta });
          if (img)    gsap.set(img,    { top: pinned.imageTop   - delta });
        });
      };

      // FORESTING OS 카드 + 헤더 + 우측 이미지를 fixed로 전환
      const pinLastCard = () => {
        const card   = triggerRefs.current[LAST_INDEX];
        const header = slotHeaderRef.current;
        const img    = rightStickyRef.current;
        const spacer = lastCardSpacerRef.current;
        if (!card || docked) return;

        const cR = card.getBoundingClientRect();
        const hR = header?.getBoundingClientRect();
        const iR = img?.getBoundingClientRect();

        pinned.cardTop     = cR.top;
        pinned.cardLeft    = cR.left;
        pinned.cardWidth   = cR.width;
        pinned.headerLeft  = hR?.left  ?? 0;
        pinned.headerWidth = hR?.width ?? 0;
        pinned.imageTop    = iR?.top   ?? 64;
        pinned.imageLeft   = iR?.left  ?? 0;
        pinned.imageWidth  = iR?.width ?? 454;
        dockScrollY = window.scrollY;
        docked = true;

        if (spacer) {
          spacer.style.height  = `${cR.height}px`;
          spacer.style.display = "block";
        }

        gsap.set(card,   { position: "fixed", top: pinned.cardTop,  left: pinned.cardLeft,  width: pinned.cardWidth,  zIndex: 15, margin: 0 });
        gsap.set(header, { position: "fixed", top: 64,              left: pinned.headerLeft, width: pinned.headerWidth, zIndex: 15 });
        if (img) gsap.set(img, { position: "fixed", top: pinned.imageTop, left: pinned.imageLeft, width: pinned.imageWidth, zIndex: 15 });

        window.addEventListener("scroll", trackScroll, { passive: true });
      };

      // pin 해제 — sticky 복원
      const unpinLastCard = () => {
        if (!docked) return;
        docked = false;
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", trackScroll);

        const card   = triggerRefs.current[LAST_INDEX];
        const header = slotHeaderRef.current;
        const img    = rightStickyRef.current;
        const spacer = lastCardSpacerRef.current;

        if (card)   gsap.set(card,   { clearProps: "position,top,left,width,zIndex,margin" });
        if (header) gsap.set(header, { clearProps: "position,top,left,width,zIndex" });
        if (img)    gsap.set(img,    { clearProps: "position,top,left,width,zIndex" });
        if (spacer) spacer.style.display = "none";
      };

      // ── 피처 전환 ScrollTrigger ────────────────────────────────────────────
      triggerRefs.current.forEach((trigger, i) => {
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
          start: "top 45%",
          end:   "bottom 50%",
          onEnter:     () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });

      // ── PIN SENTINEL trigger ───────────────────────────────────────────────
      // lastTrigger 자체를 fixed로 이동하면 ScrollTrigger 계산이 깨지므로
      // FORESTING 카드 바로 앞의 sentinel(0높이 div)을 pin 트리거로 사용.
      if (pinSentinelRef.current) {
        ScrollTrigger.create({
          trigger:     pinSentinelRef.current,
          start:       "top 30%",
          onEnter:     () => pinLastCard(),
          onEnterBack: () => unpinLastCard(),
        });
      }

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", trackScroll);
      };
    },
    { scope: containerRef },
  );

  // activeIndex 변경 시 애니메이션
  useGSAP(
    () => {
      gsap.to(sliderRef.current, {
        y:        -safeIndex * SLOT_ITEM_HEIGHT,
        duration: 0.6,
        ease:     "power2.out",
        overwrite: true,
      });

      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        gsap.to(img, {
          opacity:  i === safeIndex ? 1 : 0,
          duration: 0.5,
          ease:     "power2.out",
          overwrite: true,
        });
      });

      triggerRefs.current.forEach((item, i) => {
        if (!item) return;
        gsap.to(item, {
          opacity:  i === safeIndex ? 1 : 0.2,
          duration: 0.4,
          ease:     "power2.out",
          overwrite: true,
        });
      });
    },
    { dependencies: [safeIndex] },
  );

  return (
    <div ref={containerRef} className="mx-auto max-w-[1136px] px-6 lg:px-0">
      {/* DESKTOP */}
      <div className="hidden gap-16 lg:flex">
        {/* Left column */}
        <div className="min-w-0 flex-1">
          <div ref={slotHeaderRef} className="sticky top-16 z-10 bg-white pb-6 pt-10">
            <p className="mb-2 text-sm tracking-wide text-gray-400">Core Products</p>
            <div className="overflow-hidden" style={{ height: SLOT_ITEM_HEIGHT }}>
              <div ref={sliderRef}>
                {FEATURES.map((f) => (
                  <div key={f.id} className="flex items-center" style={{ height: SLOT_ITEM_HEIGHT }}>
                    <span className="text-4xl font-bold leading-none text-orange-500">
                      {f.slideText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-white to-transparent" />
          </div>

          {FEATURES.map((feature, i) => (
            <Fragment key={feature.id}>
              {/* pin 트리거 전용 sentinel — FORESTING 카드와 동일한 문서 위치에 배치 */}
              {i === LAST_INDEX && <div ref={pinSentinelRef} className="h-0" />}
              <div
                ref={(el) => { triggerRefs.current[i] = el; }}
                className="flex min-h-[50vh] items-start"
                style={{ opacity: i === 0 ? 1 : 0.2 }}
              >
                <div className="pt-8">
                  <h3 className="text-3xl font-bold text-gray-900">{feature.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {feature.description.map((line, j) => (
                      <li key={j} className="flex items-start gap-2 text-lg text-gray-500">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Fragment>
          ))}

          {/* FORESTING 카드가 fixed로 빠질 때 레이아웃 공간 유지 */}
          <div ref={lastCardSpacerRef} style={{ display: "none" }} />
        </div>

        {/* Right column */}
        <div className="w-[714px] shrink-0">
          <div ref={rightStickyRef} className="sticky top-16 pt-10">
            <div className="relative h-[402px] w-[714px] overflow-hidden rounded-2xl shadow-2xl">
              {FEATURES.map((f, i) => (
                <div
                  key={f.id}
                  ref={(el) => { imageRefs.current[i] = el; }}
                  className="absolute inset-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <Image src={f.imgUrl} alt={f.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="w-full lg:hidden">
        {FEATURES.map((feature) => (
          <div key={feature.id} className="flex min-h-[50vh] items-center py-8">
            <div className="w-full">
              <p className="mb-1 text-sm tracking-wide text-gray-400">Core Products</p>
              <p className="text-3xl font-bold text-orange-500">{feature.slideText}</p>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">{feature.title}</h3>
              <ul className="mt-2 space-y-1">
                {feature.description.map((line, j) => (
                  <li key={j} className="flex items-start gap-2 text-base text-gray-500">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="relative mt-6 aspect-[714/402] w-full overflow-hidden rounded-2xl shadow-xl">
                <Image src={feature.imgUrl} alt={feature.title} fill className="object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
