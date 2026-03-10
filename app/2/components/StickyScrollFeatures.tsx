"use client";

import { useRef, useState } from "react";
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
      "- 사업 및 프로젝트 구조 진단",
      "- 시장 적합성 분석",
      "- 실행 우선순위 도출",
      "- 전략 리포트 생성"
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
      "개인 작업 패턴 기반 추천 시스템"
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
  }
];

const SLOT_ITEM_HEIGHT = 56;

interface StickyScrollFeaturesProps {
  onIndexChange?: (index: number) => void;
}

const LAST_FEATURE_INDEX = FEATURES.length - 1;

export default function StickyScrollFeatures({ onIndexChange }: StickyScrollFeaturesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slotHeaderRef = useRef<HTMLDivElement>(null);
  // 마지막 feature 카드 핀 용도
  const lastCardSpacerRef = useRef<HTMLDivElement>(null);

  triggerRefs.current.length = FEATURES.length;

  const safeIndex = Math.min(activeIndex, FEATURES.length - 1);

  useGSAP(
    () => {
      // 마지막 카드(FORESTING OS) 핀 상태
      let dockScrollY = 0;
      let docked = false;
      let pinnedRect = { top: 0, left: 0, width: 0, height: 0 };

      // 슬롯머신 헤더의 sticky 위치 (top: 64px)
      const HEADER_STICKY_TOP = 64;
      let headerPinnedLeft = 0;
      let headerPinnedWidth = 0;

      const trackScroll = () => {
        if (!docked) return;
        const el = triggerRefs.current[LAST_FEATURE_INDEX];
        const header = slotHeaderRef.current;
        const delta = window.scrollY - dockScrollY;
        if (el) gsap.set(el, { top: pinnedRect.top - delta });
        if (header) gsap.set(header, { top: HEADER_STICKY_TOP - delta });
      };

      const pinLastCard = () => {
        const el = triggerRefs.current[LAST_FEATURE_INDEX];
        const header = slotHeaderRef.current;
        const spacer = lastCardSpacerRef.current;
        if (!el || docked) return;

        const rect = el.getBoundingClientRect();
        pinnedRect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
        dockScrollY = window.scrollY;
        docked = true;

        // 레이아웃 유지용 spacer 활성화
        if (spacer) {
          spacer.style.height = `${rect.height}px`;
          spacer.style.display = "block";
        }

        // FORESTING OS 카드 pin
        gsap.set(el, {
          position: "fixed",
          top: rect.top,
          left: rect.left,
          width: rect.width,
          zIndex: 15,
          margin: 0,
        });

        // 슬롯머신 헤더 pin (sticky 위치 그대로 fixed로 전환)
        if (header) {
          const headerRect = header.getBoundingClientRect();
          headerPinnedLeft = headerRect.left;
          headerPinnedWidth = headerRect.width;
          gsap.set(header, {
            position: "fixed",
            top: HEADER_STICKY_TOP,
            left: headerPinnedLeft,
            width: headerPinnedWidth,
            zIndex: 15,
          });
        }

        window.addEventListener("scroll", trackScroll, { passive: true });
      };

      const unpinLastCard = () => {
        const el = triggerRefs.current[LAST_FEATURE_INDEX];
        const header = slotHeaderRef.current;
        const spacer = lastCardSpacerRef.current;
        if (!el || !docked) return;

        docked = false;
        window.removeEventListener("scroll", trackScroll);

        gsap.set(el, { position: "", top: "", left: "", width: "", zIndex: "", margin: "" });
        if (header) gsap.set(header, { position: "", top: "", left: "", width: "", zIndex: "" });
        if (spacer) spacer.style.display = "none";
      };

      triggerRefs.current.forEach((trigger, i) => {
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
          start: i === LAST_FEATURE_INDEX ? "top 40%" : "top 65%",
          end: "bottom 60%",
          onEnter: () => {
            setActiveIndex(i);
            onIndexChange?.(i);
            // pinLastCard는 별도 trigger에서 더 늦게 실행
          },
          onEnterBack: () => {
            setActiveIndex(i);
            onIndexChange?.(i);
            // 마지막 카드 이전으로 역스크롤 시 unpin
            if (i === LAST_FEATURE_INDEX - 1) unpinLastCard();
          },
        });
      });

      // FORESTING OS pin은 이미지/텍스트 전환보다 더 늦게 발동
      const lastTrigger = triggerRefs.current[LAST_FEATURE_INDEX];
      if (lastTrigger) {
        ScrollTrigger.create({
          trigger: lastTrigger,
          start: "top 30%",
          onEnter: () => pinLastCard(),
        });
      }

      return () => {
        window.removeEventListener("scroll", trackScroll);
      };
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      gsap.to(sliderRef.current, {
        y: -safeIndex * SLOT_ITEM_HEIGHT,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });

      triggerRefs.current.forEach((item, i) => {
        if (!item) return;
        gsap.to(item, {
          opacity: i === safeIndex ? 1 : 0.2,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      });
    },
    { dependencies: [safeIndex] },
  );

  return (
    <div id="features-section" ref={containerRef} className="mx-auto max-w-[1400px] px-6 lg:px-0">
      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT (2-column flex)
      ══════════════════════════════════════════ */}
      <div className="hidden gap-16 lg:flex">
        {/* ── Left column: sticky 슬롯머신 헤더 + 스크롤 텍스트 ── */}
        <div className="min-w-0 flex-1">
          <div ref={slotHeaderRef} className="sticky top-16 z-10 bg-white pb-6 pt-10">
            <p className="mb-2 text-sm tracking-wide text-gray-400">Core Products</p>
            <div className="overflow-hidden" style={{ height: SLOT_ITEM_HEIGHT }}>
              <div ref={sliderRef}>
                {FEATURES.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center"
                    style={{ height: SLOT_ITEM_HEIGHT }}
                  >
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
            <div
              key={feature.id}
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              data-feature-index={i}
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
          ))}
          {/* 마지막 카드 pin 시 레이아웃 유지용 spacer */}
          <div ref={lastCardSpacerRef} style={{ display: "none" }} />
        </div>

        {/* ── Right column: ghost anchor (HeroImage flying 이미지의 morph target) ── */}
        <div className="w-[842px] shrink-0">
          <div className="sticky top-16 pt-10">
            <div id="loam-sticky-image" className="h-[474px] w-[842px]" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE: 카드 스택 레이아웃
      ══════════════════════════════════════════ */}
      <div className="w-full lg:hidden">
        {FEATURES.map((feature) => (
          <div key={feature.id} className="flex min-h-[50vh] items-center py-8">
            <div className="w-full">
              <p className="mb-1 text-sm tracking-wide text-gray-400">The AppGen platform</p>
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
              <div className="relative mt-6 w-full overflow-hidden rounded-2xl shadow-xl aspect-[842/474]">
                <Image src={feature.imgUrl} alt={feature.title} fill className="object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
