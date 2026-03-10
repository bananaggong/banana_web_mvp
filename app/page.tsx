import Image from "next/image";
import StickyScrollFeatures from "@/components/StickyScrollFeatures";

export default function Page() {
  return (
    <div className="font-sans text-gray-900 antialiased">
      {/* ================================================================
          HEADER
      ================================================================ */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-12 lg:px-16">
        {/* 로고 */}
        <div className="h-7 w-24 rounded bg-gray-200" />

        {/* 중앙 내비 */}
        <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          {["testtest", "testtest", "testtest", "testtest", "testtest"].map((item, i) => (
            <a key={i} href="#" className="hover:text-gray-900">
              {item}
            </a>
          ))}
        </nav>

        {/* 우측 버튼 */}
        <div className="flex items-center gap-3">
          <a href="#" className="hidden text-sm text-gray-600 hover:text-gray-900 md:block">
            testtest
          </a>
          <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
            testtest
          </button>
        </div>
      </header>

      <main>
        {/* ================================================================
            SECTION 0: VIDEO HERO — 1920×1335 비율 전체 너비 비디오 영역
        ================================================================ */}
        <section className="relative w-full overflow-hidden">
          {/* 비디오 */}
          <video
            src="/main.webp"
            autoPlay
            loop
            muted
            playsInline
            className="aspect-[1920/1335] w-full object-cover"
          />
          {/* 어두운 그림자 오버레이 */}
          <div className="absolute inset-0 bg-black/40" />
          {/* 오버레이 텍스트 */}
          <div className="absolute inset-0 flex items-end justify-start px-12 pb-16 lg:px-20 lg:pb-24">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              We Build Infrastructure For Execution
            </h1>
          </div>
        </section>

        {/* ================================================================
            SECTION 1: HERO
        ================================================================ */}
        <section className="mx-auto max-w-[956px] px-6 pb-20 pt-16 lg:px-0">
          {/* 부제목 + 설명 + 이미지 */}
          <div className="w-full">
            <div className="flex flex-col items-start text-left">
              <h2 className="font-bold leading-snug text-gray-900" style={{ fontSize: "38px" }}>
                AI와 데이터를 기반으로 판단, 전략, 실행을 연결하는
                <br />
                Banana Technology.
              </h2>
              <p className="mt-4 leading-relaxed text-gray-500" style={{ fontSize: "22px" }}>
                우리는 복잡한 문제를 구조화하고
                <br />
                아이디어와 전략이 실제 실행으로 이어질 수 있도록 소프트웨어와 실행 인프라를 설계한다.
              </p>
            </div>

            {/* 히어로 이미지 — 989×548 */}
            <div className="mt-12 overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/HeroImg.png"
                alt="Hero"
                width={989}
                height={548}
                className="w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: FEATURES — GSAP 스티키 스크롤 (독립형)
        ================================================================ */}
        <section className="py-20">
          {/* 섹션 타이틀 */}
          <div className="mx-auto max-w-[1136px] px-6 pb-16 lg:px-0">
            <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              testtest{" "}
              <span className="text-orange-500">testtest testtest</span>{" "}
              testtest testtest testtest testtest testtest.
            </h2>
          </div>

          {/* 스티키 스크롤 피처 (HeroImage와 독립 — 자체 sticky 이미지 보유) */}
          <StickyScrollFeatures />
        </section>

        {/* ================================================================
            SECTION 3: INTEGRATIONS
        ================================================================ */}
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-24 md:flex-row md:gap-16 lg:px-16">
          <div className="w-full flex-1">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              testtest testtest testtest testtest.
            </h2>
            <p className="mt-5 text-lg text-gray-500">
              testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest
              testtest testtest testtest testtest.
            </p>
            <button className="mt-8 rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700">
              testtest
            </button>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: GETTING STARTED
        ================================================================ */}
        <section className="bg-[#FAF6EF] px-6 py-24 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-bold md:text-5xl">testtest testtest testtest testtest.</h2>
            <p className="mt-3 text-lg text-gray-500">
              testtest testtest testtest testtest testtest testtest testtest.
            </p>

            <div className="mt-10 flex flex-wrap gap-1 border-b border-gray-300">
              {["testtest", "testtest", "testtest", "testtest", "testtest", "testtest"].map(
                (tab, i) => (
                  <button
                    key={i}
                    className={`rounded-t-md px-5 py-3 text-sm font-medium ${
                      i === 0
                        ? "border-b-2 border-gray-900 bg-white text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <div className="mt-6 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md md:flex-row md:gap-10">
              <div className="w-full md:w-56">
                <h3 className="mb-4 text-xl font-bold">testtest testtest</h3>
                <ul className="flex flex-col gap-1">
                  {["testtest testtest", "testtest", "testtest", "testtest"].map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                          i === 0
                            ? "bg-gray-100 font-medium text-gray-900"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {item}
                        {i === 0 && <span>→</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-200" />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">testtest testtest testtest</p>
                    <p className="mt-1 text-sm text-gray-500">
                      testtest testtest testtest testtest testtest.
                    </p>
                  </div>
                  <button className="ml-4 shrink-0 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700">
                    testtest testtest testtest
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-16 border-t border-gray-300 pt-12">
              <h3 className="text-3xl font-bold leading-tight md:text-4xl">
                testtest testtest testtest testtest{" "}
                <span className="text-orange-500">testtest testtest testtest testtest?</span>
              </h3>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
                  testtest testtest
                </button>
                <button className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  testtest testtest testtest
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer className="border-t border-gray-200 bg-white px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <div className="h-7 w-20 rounded bg-gray-200" />
              <p className="mt-4 text-sm text-gray-400">
                testtest testtest testtest testtest.
              </p>
            </div>
            {[1, 2, 3, 4].map((col) => (
              <div key={col}>
                <p className="mb-3 text-sm font-semibold text-gray-700">testtest</p>
                <ul className="flex flex-col gap-2 text-sm text-gray-400">
                  {[1, 2, 3, 4].map((row) => (
                    <li key={row}>
                      <a href="#" className="hover:text-gray-700">
                        testtest
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
            testtest testtest testtest testtest testtest.
          </div>
        </div>
      </footer>
    </div>
  );
}
