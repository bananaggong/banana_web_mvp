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
  description: string;
  imgUrl: string;
}

const FEATURES: Feature[] = [
  {
    id: 1,
    slideText: "for every use case",
    title: "Welcome to AppGen",
    description: "Start building your internal software from the first prompt.",
    imgUrl:
      "https://images.unsplash.com/photo-1618477247222-ac60ceb0a416?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    slideText: "for AI & LLMs",
    title: "Build agents, workflows",
    description:
      "Integrate AI models, databases, tools, and systems to build powerful solutions.",
    imgUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    slideText: "for data teams",
    title: "Transform raw data",
    description:
      "Go beyond business intelligence. Build apps that read and write from your data sources.",
    imgUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    slideText: "for operations teams",
    title: "Streamline processes",
    description:
      "Build software solutions that were previously out of reach and reduce manual work.",
    imgUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
  },
];

// 슬롯머신 각 아이템의 고정 높이 (px)
const SLOT_ITEM_HEIGHT = 56;

export default function StickyScrollFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textContentRef = useRef<HTMLDivElement>(null);

  // ScrollTrigger 등록 (마운트 시 1회 실행)
  useGSAP(
    () => {
      triggerRefs.current.forEach((trigger, i) => {
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });
    },
    { scope: containerRef },
  );

  // activeIndex 변경 시 애니메이션 실행
  useGSAP(
    () => {
      // 슬롯머신: 고정 픽셀 높이 기반 y축 이동
      gsap.to(sliderRef.current, {
        y: -activeIndex * SLOT_ITEM_HEIGHT,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });

      // 이미지 크로스페이드
      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        gsap.to(img, {
          opacity: i === activeIndex ? 1 : 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      });

      // 텍스트 콘텐츠 페이드인
      if (textContentRef.current) {
        gsap.fromTo(
          textContentRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      }
    },
    { dependencies: [activeIndex] },
  );

  const active = FEATURES[activeIndex];

  return (
    <div ref={containerRef} className="flex">
      {/* ── Left Sticky Panel (데스크탑 전용) ── */}
      <div className="sticky top-0 hidden h-screen w-5/12 shrink-0 items-center justify-end pr-12 lg:flex">
        <div className="w-full max-w-xs">
          <p className="mb-2 text-sm tracking-wide text-gray-400">The AppGen platform</p>

          {/* 슬롯머신 마스크 */}
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

          {/* 활성 섹션 타이틀 & 설명 */}
          <div ref={textContentRef} className="mt-6">
            <h3 className="text-2xl font-bold text-gray-900">{active.title}</h3>
            <p className="mt-3 leading-relaxed text-gray-500">{active.description}</p>
          </div>

          {/* 진행 인디케이터 */}
          <div className="mt-8 flex gap-2">
            {FEATURES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === activeIndex ? "w-8 bg-orange-500" : "w-3 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Center Column: 스크롤 트리거 + 모바일 콘텐츠 ── */}
      <div className="grow">
        {FEATURES.map((feature, i) => (
          <div
            key={feature.id}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
            className="flex h-screen items-center justify-center lg:block"
          >
            {/* 모바일: 인라인 카드 레이아웃 */}
            <div className="px-6 py-12 lg:hidden">
              <p className="mb-1 text-sm tracking-wide text-gray-400">The AppGen platform</p>
              <p className="text-3xl font-bold text-orange-500">{feature.slideText}</p>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 leading-relaxed text-gray-500">{feature.description}</p>
              <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
                <Image src={feature.imgUrl} alt={feature.title} fill className="object-cover" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Right Sticky Panel: 이미지 뷰어 (데스크탑 전용) ── */}
      <div className="sticky top-0 hidden h-screen w-5/12 shrink-0 items-center justify-start pl-12 lg:flex">
        <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
          {FEATURES.map((f, i) => (
            <div
              key={f.id}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image src={f.imgUrl} alt={f.title} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
