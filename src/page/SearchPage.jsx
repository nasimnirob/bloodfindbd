import { IoCloseSharp, IoTimeOutline } from "react-icons/io5";
import { RiArrowLeftLine, RiFindReplaceLine, RiSearchLine } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useRecentSearches from "../hooks/useRecentSearches";
import DonorCard from "../component/DonorCard";

const API_URL = import.meta.env.VITE_API_URL;

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const inputRef = useRef(null);

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [isVisible, setIsVisible] = useState(false);

    const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } =
        useRecentSearches();

    useEffect(() => {
        const raf = requestAnimationFrame(() => setIsVisible(true));
        const focusTimer = setTimeout(() => inputRef.current?.focus(), 300);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(focusTimer);
        };
    }, []);

    const handleBack = () => {
        setIsVisible(false);
        setTimeout(() => navigate(-1), 300);
    };


    useEffect(() => {
        const controller = new AbortController();

        const timer = setTimeout(() => {
            if (query.trim()) {
                setSearchParams({ q: query }, { replace: true });
                fetchResults(query, controller.signal);
                addRecentSearch(query);
            } else {
                setSearchParams({}, { replace: true });
                setResults([]);
                setError("");
            }
        }, 400); // debounce

        return () => {
            clearTimeout(timer);
            controller.abort();
        };

    }, [query]);

    const fetchResults = async (q, signal) => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}/donors?search=${encodeURIComponent(q)}`, { signal });
            if (!res.ok) throw new Error("খুঁজতে সমস্যা হয়েছে");
            const data = await res.json();
            setResults(data);
            setIsLoading(false);
        } catch (err) {
            if (err.name === "AbortError") return;
            setError(err.message || "খুঁজতে সমস্যা হয়েছে");
            setIsLoading(false);
        }
    };

    const handleRecentClick = (item) => {
        setQuery(item.name);
    };

    return (
        <div className="">
            <div
                className={`fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"
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
                            placeholder="Search Blood Group, Name, District.."
                        />
                        <button
                            onClick={() => {
                                if (query.trim()) {
                                    fetchResults(query);
                                    addRecentSearch(query);
                                }
                            }}
                            className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-500 hover:text-red-600 transition-colors"
                        >
                            <RiFindReplaceLine />
                        </button>
                    </div>
                </div>

                {/* Body: recent searches OR live donor results */}
                <div className="flex-1 overflow-y-auto items-center">
                    {query.trim() === "" ? (
                        <>
                            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                                <p className="font-semibold text-gray-900">Recent</p>
                                {recentSearches.length > 0 && (
                                    <button
                                        onClick={clearRecentSearches}
                                        className="text-sm text-blue-600 font-medium hover:underline"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="pb-2">
                                {recentSearches.length === 0 && (
                                    <p className="px-4 py-6 text-sm text-gray-400 text-center">
                                        No recent search....
                                    </p>
                                )}

                                {recentSearches.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleRecentClick(item)}
                                        className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                <IoTimeOutline className="text-gray-500 text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {item.name}
                                                </p>
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
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                                    ))}
                                </div>
                            ) : error ? (
                                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </p>
                            ) : results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-14 text-center">
                                    <RiSearchLine className="mb-2 text-3xl text-gray-300" />
                                    <p className="text-sm text-gray-500">No available donor</p>
                                    <p className="text-xs text-gray-400">Please Try to Search another blood group, name, district..</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {results.map((donor) => (
                                        <DonorCard key={donor._id || donor.email} donor={donor} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;