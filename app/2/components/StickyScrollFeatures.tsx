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

export default function StickyScrollFeatures({ onIndexChange }: StickyScrollFeaturesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  triggerRefs.current.length = FEATURES.length;

  const safeIndex = Math.min(activeIndex, FEATURES.length - 1);

  useGSAP(
    () => {
      triggerRefs.current.forEach((trigger, i) => {
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
          start: "top 35%",
          end: "bottom 50%",
          onEnter: () => {
            setActiveIndex(i);
            onIndexChange?.(i);
          },
          onEnterBack: () => {
            setActiveIndex(i);
            onIndexChange?.(i);
          },
        });
      });
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
    <div id="features-section" ref={containerRef} className="mx-auto max-w-[1136px] px-6 lg:px-0">
      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT (2-column flex)
      ══════════════════════════════════════════ */}
      <div className="hidden gap-16 lg:flex">
        {/* ── Left column: sticky 슬롯머신 헤더 + 스크롤 텍스트 ── */}
        <div className="min-w-0 flex-1">
          <div className="sticky top-16 z-10 bg-white pb-6 pt-10">
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
        </div>

        {/* ── Right column: ghost anchor (HeroImage flying 이미지의 morph target) ── */}
        <div className="w-[454px] shrink-0">
          <div className="sticky top-16 pt-10">
            <div id="loam-sticky-image" className="h-[433px] w-[454px]" />
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
              <div className="relative mt-6 w-full overflow-hidden rounded-2xl shadow-xl aspect-[454/433]">
                <Image src={feature.imgUrl} alt={feature.title} fill className="object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
