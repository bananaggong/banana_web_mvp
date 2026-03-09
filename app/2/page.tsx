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
            SECTION 1: HERO — 좌 텍스트 / 우 제품 스크린샷
        ================================================================ */}
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-24 md:flex-row md:gap-16 lg:px-16">
          {/* 좌: 헤드라인 + 버튼 */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              testtest testtest testtest testtest testtest.
            </h1>
            <p className="mt-5 text-xl text-gray-500">
              testtest testtest testtest testtest testtest testtest testtest testtest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700">
                testtest testtest testtest
              </button>
              <button className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                testtest testtest
              </button>
            </div>
          </div>

          {/* 우: 제품 스크린샷 플레이스홀더 */}
          <div className="w-full flex-1">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-2xl" />
          </div>
        </section>

        {/* ================================================================
            SECTION 2: FEATURES — 타이틀 + 3개 피처 행 (교대 배치)
        ================================================================ */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
          {/* 섹션 타이틀 */}
          <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            testtest{" "}
            <span className="text-orange-500">testtest testtest</span>{" "}
            testtest testtest testtest testtest testtest.
          </h2>

          {/* 피처 행들 */}
          <div className="mt-20 flex flex-col gap-24">
            {/* 피처 1: 텍스트 좌 / 이미지 우 */}
            <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
              <div className="flex-1">
                <div className="mb-3 h-10 w-10 rounded-lg bg-gray-200" />
                <h3 className="text-3xl font-bold">testtest</h3>
                <p className="mt-3 text-lg text-gray-500">
                  testtest testtest testtest testtest testtest testtest testtest testtest testtest.
                </p>
                <button className="mt-5 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
                  testtest testtest testtest
                </button>
                <p className="mt-6 text-sm text-gray-400">testtest</p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-6 rounded bg-gray-200" />
                  ))}
                </div>
              </div>
              <div className="w-full flex-1">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-xl" />
              </div>
            </div>

            {/* 피처 2: 이미지 좌 / 텍스트 우 */}
            <div className="flex flex-col items-center gap-12 md:flex-row-reverse md:gap-16">
              <div className="flex-1">
                <div className="mb-3 h-10 w-10 rounded-lg bg-gray-200" />
                <h3 className="text-3xl font-bold">testtest</h3>
                <p className="mt-3 text-lg text-gray-500">
                  testtest testtest testtest testtest testtest testtest testtest testtest testtest.
                </p>
                <button className="mt-5 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
                  testtest testtest testtest
                </button>
                <p className="mt-6 text-sm text-gray-400">testtest</p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-6 rounded bg-gray-200" />
                  ))}
                </div>
              </div>
              <div className="w-full flex-1">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-xl" />
              </div>
            </div>

            {/* 피처 3: 텍스트 좌 / 이미지 우 */}
            <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
              <div className="flex-1">
                <div className="mb-3 h-10 w-10 rounded-lg bg-gray-200" />
                <h3 className="text-3xl font-bold">testtest</h3>
                <p className="mt-3 text-lg text-gray-500">
                  testtest testtest testtest testtest testtest testtest testtest testtest testtest.
                </p>
                <button className="mt-5 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700">
                  testtest testtest testtest
                </button>
                <p className="mt-6 text-sm text-gray-400">testtest</p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-6 rounded bg-gray-200" />
                  ))}
                </div>
              </div>
              <div className="w-full flex-1">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: INTEGRATIONS — 이미지 좌 / 텍스트 우
        ================================================================ */}
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-24 md:flex-row md:gap-16 lg:px-16">
          {/* 좌: 제품 스크린샷 */}
          <div className="w-full flex-1">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-xl" />
          </div>

          {/* 우: 텍스트 + 버튼 */}
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
            SECTION 4: GETTING STARTED — 탭 + 템플릿 프리뷰
        ================================================================ */}
        <section className="bg-[#FAF6EF] px-6 py-24 lg:px-16">
          <div className="mx-auto max-w-7xl">
            {/* 섹션 타이틀 */}
            <h2 className="text-4xl font-bold md:text-5xl">testtest testtest testtest testtest.</h2>
            <p className="mt-3 text-lg text-gray-500">
              testtest testtest testtest testtest testtest testtest testtest.
            </p>

            {/* 탭 네비게이션 */}
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

            {/* 탭 콘텐츠 영역 */}
            <div className="mt-6 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md md:flex-row md:gap-10">
              {/* 좌: 링크 리스트 */}
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

              {/* 우: 프리뷰 */}
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

            {/* 하단 CTA 배너 */}
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
          {/* 상단: 로고 + 링크 그리드 */}
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

          {/* 하단: 카피라이트 */}
          <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
            testtest testtest testtest testtest testtest.
          </div>
        </div>
      </footer>
    </div>
  );
}
