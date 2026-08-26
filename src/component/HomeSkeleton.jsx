const HomeSkeleton = () => {
    return (
        <div className="w-full animate-pulse bg-linear-to-b from-rose-50 via-rose-50/60 to-white">

            {/* ================= HERO ================= */}
            <section className="relative mx-auto flex max-w-[1920px] min-h-[650px] flex-col items-center justify-center px-6 pb-20 pt-24 text-center">

                {/* Badge */}
                <div className="h-8 w-44 rounded-full bg-gray-200" />

                {/* Heading */}
                <div className="mt-10 space-y-4">
                    <div className="mx-auto h-12 w-72 rounded-lg bg-gray-200 sm:h-14 sm:w-96" />
                    <div className="mx-auto h-12 w-56 rounded-lg bg-gray-200 sm:h-14 sm:w-72" />
                    <div className="mx-auto h-12 w-64 rounded-lg bg-gray-200 sm:h-14 sm:w-80" />
                </div>

                {/* Description */}
                <div className="mt-8 space-y-3">
                    <div className="mx-auto h-4 w-[90%] max-w-2xl rounded bg-gray-200" />
                    <div className="mx-auto h-4 w-[70%] max-w-xl rounded bg-gray-200" />
                </div>

                {/* Buttons */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <div className="h-14 w-52 rounded-full bg-gray-200" />
                    <div className="h-14 w-56 rounded-full bg-gray-200" />
                </div>

                {/* Features */}
                <div className="mt-10 flex flex-wrap justify-center gap-6">
                    <div className="h-5 w-28 rounded bg-gray-200" />
                    <div className="h-5 w-32 rounded bg-gray-200" />
                    <div className="h-5 w-32 rounded bg-gray-200" />
                    <div className="h-5 w-40 rounded bg-gray-200" />
                </div>
            </section>


            {/* ================= STATS ================= */}
            <section className="relative mx-auto -mt-16 max-w-6xl px-6">
                <div className="grid grid-cols-2 gap-6 rounded-2xl border border-red-100 bg-white p-8 sm:grid-cols-4">

                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex flex-col items-center gap-3">
                            <div className="h-9 w-24 rounded bg-gray-200" />
                            <div className="h-4 w-28 rounded bg-gray-200" />
                        </div>
                    ))}

                </div>
            </section>


            {/* ================= HOW IT WORKS ================= */}
            <section className="mx-auto max-w-6xl px-6 py-24">

                {/* Heading */}
                <div className="mb-14 flex flex-col items-center gap-3">
                    <div className="h-9 w-52 rounded bg-gray-200" />
                    <div className="h-4 w-72 rounded bg-gray-200" />
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-red-100 bg-white p-6"
                        >
                            <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-gray-200" />

                            <div className="mx-auto h-5 w-28 rounded bg-gray-200" />

                            <div className="mx-auto mt-4 space-y-2">
                                <div className="h-3 w-full rounded bg-gray-200" />
                                <div className="mx-auto h-3 w-4/5 rounded bg-gray-200" />
                                <div className="mx-auto h-3 w-3/5 rounded bg-gray-200" />
                            </div>
                        </div>
                    ))}

                </div>
            </section>


            {/* ================= BLOOD GROUP ================= */}
            <section className="bg-white py-24">

                <div className="mx-auto max-w-6xl px-6">

                    <div className="mb-12 flex flex-col items-center gap-3">
                        <div className="h-9 w-80 rounded bg-gray-200" />
                        <div className="h-4 w-72 rounded bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">

                        {[
                            1, 2, 3, 4,
                            5, 6, 7, 8
                        ].map((item) => (
                            <div
                                key={item}
                                className="h-24 rounded-2xl bg-gray-200"
                            />
                        ))}

                    </div>

                </div>
            </section>


            {/* ================= URGENT REQUESTS ================= */}
            <section className="mx-auto max-w-6xl px-6 py-24">

                {/* Header */}
                <div className="mb-12 flex flex-wrap items-end justify-between gap-4">

                    <div className="space-y-3">
                        <div className="h-9 w-64 rounded bg-gray-200" />
                        <div className="h-4 w-96 max-w-full rounded bg-gray-200" />
                    </div>

                    <div className="h-5 w-36 rounded bg-gray-200" />

                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-red-100 bg-white p-6"
                        >

                            <div className="flex items-center justify-between">
                                <div className="h-11 w-11 rounded-full bg-gray-200" />
                                <div className="h-6 w-16 rounded-full bg-gray-200" />
                            </div>

                            <div className="mt-5 h-5 w-32 rounded bg-gray-200" />

                            <div className="mt-3 h-4 w-40 rounded bg-gray-200" />

                            <div className="mt-2 h-3 w-20 rounded bg-gray-200" />

                            <div className="mt-5 h-10 w-full rounded-full bg-gray-200" />

                        </div>
                    ))}

                </div>
            </section>


            {/* ================= WHY CHOOSE US ================= */}
            <section className="bg-white py-24">

                <div className="mx-auto max-w-6xl px-6">

                    <div className="mb-14 flex flex-col items-center gap-3">
                        <div className="h-9 w-64 rounded bg-gray-200" />
                        <div className="h-4 w-80 rounded bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex flex-col items-center text-center"
                            >

                                <div className="h-14 w-14 rounded-2xl bg-gray-200" />

                                <div className="mt-5 h-5 w-28 rounded bg-gray-200" />

                                <div className="mt-4 w-full space-y-2">
                                    <div className="h-3 w-full rounded bg-gray-200" />
                                    <div className="mx-auto h-3 w-4/5 rounded bg-gray-200" />
                                    <div className="mx-auto h-3 w-3/5 rounded bg-gray-200" />
                                </div>

                            </div>
                        ))}

                    </div>

                </div>
            </section>


            {/* ================= TESTIMONIALS ================= */}
            <section className="mx-auto max-w-6xl px-6 py-24">

                <div className="mb-14 flex flex-col items-center gap-3">
                    <div className="h-9 w-72 rounded bg-gray-200" />
                    <div className="h-4 w-64 rounded bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">

                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-red-100 bg-white p-8"
                        >

                            <div className="h-8 w-8 rounded bg-gray-200" />

                            <div className="mt-5 space-y-3">
                                <div className="h-4 w-full rounded bg-gray-200" />
                                <div className="h-4 w-full rounded bg-gray-200" />
                                <div className="h-4 w-4/5 rounded bg-gray-200" />
                            </div>

                            <div className="mt-7 h-5 w-36 rounded bg-gray-200" />

                            <div className="mt-2 h-4 w-28 rounded bg-gray-200" />

                        </div>
                    ))}

                </div>
            </section>


            {/* ================= CTA ================= */}
            <section className="mx-auto max-w-6xl px-6 pb-24">

                <div className="rounded-3xl bg-gray-200 px-8 py-14 sm:px-16">

                    <div className="mx-auto h-9 w-80 max-w-full rounded bg-gray-300" />

                    <div className="mx-auto mt-5 h-4 w-96 max-w-full rounded bg-gray-300" />

                    <div className="mx-auto mt-8 h-12 w-48 rounded-full bg-gray-300" />

                </div>

            </section>

        </div>
    );
};

export default HomeSkeleton;