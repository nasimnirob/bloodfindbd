import { IoCloseSharp, IoTimeOutline } from "react-icons/io5";
import { RiArrowLeftLine, RiFindReplaceLine } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const inputRef = useRef(null);

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // ডান দিক থেকে slide-in করার জন্য — mount এর প্রথম frame এ false রেখে,
    // পরের frame এ true করলে transition ঠিকমতো play হয়
    const [isVisible, setIsVisible] = useState(false);

    // TODO: এখানে আসল recent-search data (API/localStorage থেকে) বসবে
    const [recentSearches, setRecentSearches] = useState([
        { id: 1, type: "person", name: "Ra Ha Chowdhury", subtitle: "1 new", initial: "R" },
        { id: 2, type: "person", name: "Abdur Rahman", subtitle: "1 new", initial: "A" },
        { id: 3, type: "query", name: "Sunnah Square", subtitle: "4 new" },
        { id: 4, type: "person", name: "Ebrahim Chowdhury", subtitle: "9+ new", initial: "E" },
        { id: 5, type: "person", name: "NA SI M", initial: "N" },
        { id: 6, type: "query", name: "fifa world cup 2026 live" },
        { id: 7, type: "person", name: "Jesmin Islam", initial: "J" },
        { id: 8, type: "person", name: "Md Hossen", subtitle: "6 mutual friends", initial: "M" },
    ]);

    // mount হওয়ার পরপরই slide-in trigger করা এবং transition শেষ হওয়ার পর input focus
    useEffect(() => {
        const raf = requestAnimationFrame(() => setIsVisible(true));
        const focusTimer = setTimeout(() => inputRef.current?.focus(), 300);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(focusTimer);
        };
    }, []);

    // Back বাটনে slide-out animation শেষ হওয়ার পর আসল navigation
    const handleBack = () => {
        setIsVisible(false);
        setTimeout(() => navigate(-1), 300);
    };

    // টাইপ করার সাথে সাথে URL (?q=...) sync + debounce করে fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                setSearchParams({ q: query }, { replace: true });
                fetchResults(query);
            } else {
                setSearchParams({}, { replace: true });
                setResults([]);
            }
        }, 400); // debounce

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const fetchResults = async (q) => {
        setIsLoading(true);
        try {
            // TODO: আসল API কল বসবে এখানে, যেমন:
            // const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            // const data = await res.json();
            // setResults(data);

            // demo/dummy placeholder — আসল integration এ বাদ দেবেন
            await new Promise((r) => setTimeout(r, 300));
            setResults([
                { id: "r1", name: `"${q}" এর জন্য ফলাফল ১` },
                { id: "r2", name: `"${q}" এর জন্য ফলাফল ২` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const removeRecentSearch = (id) => {
        setRecentSearches((prev) => prev.filter((item) => item.id !== id));
    };

    const handleRecentClick = (item) => {
        setQuery(item.name);
    };

    return (
        <div
            className={`fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
                isVisible ? "translate-x-0" : "translate-x-full"
            }`}
        >
            {/* Top bar: back + input */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 shrink-0">
                <button
                    onClick={handleBack}
                    className="shrink-0 p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <RiArrowLeftLine className="text-xl" />
                </button>

                <div className="relative flex-1 min-w-0">
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 pr-9 py-[7px] rounded-full border border-[#eaedf1] bg-[#f7f8f9] text-sm outline-none focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
                        type="search"
                        placeholder="Search Blood.."
                    />
                    <button
                        onClick={() => query.trim() && fetchResults(query)}
                        className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <RiFindReplaceLine />
                    </button>
                </div>
            </div>

            {/* Body: recent searches OR live results */}
            <div className="flex-1 overflow-y-auto">
                {query.trim() === "" ? (
                    <>
                        <div className="flex items-center justify-between px-4 pt-3 pb-1">
                            <p className="font-semibold text-gray-900">Recent</p>
                            <button className="text-sm text-blue-600 font-medium hover:underline">
                                Edit
                            </button>
                        </div>

                        <div className="pb-2">
                            {recentSearches.length === 0 && (
                                <p className="px-4 py-6 text-sm text-gray-400 text-center">
                                    কোনো recent search নেই
                                </p>
                            )}

                            {recentSearches.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleRecentClick(item)}
                                    className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {item.type === "person" ? (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                                {item.initial}
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                <IoTimeOutline className="text-gray-500 text-xl" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {item.name}
                                            </p>
                                            {item.subtitle && (
                                                <p className="text-xs text-gray-500 truncate">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeRecentSearch(item.id);
                                        }}
                                        className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors shrink-0"
                                    >
                                        <IoCloseSharp className="text-lg" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="px-4 py-3">
                        {isLoading ? (
                            <p className="text-sm text-gray-400">খোঁজা হচ্ছে...</p>
                        ) : results.length === 0 ? (
                            <p className="text-sm text-gray-400">কোনো ফলাফল পাওয়া যায়নি</p>
                        ) : (
                            <ul className="space-y-1">
                                {results.map((r) => (
                                    <li
                                        key={r.id}
                                        className="px-2 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-800"
                                    >
                                        {r.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
