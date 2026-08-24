import { IoCloseSharp, IoPersonCircleOutline, IoTimeOutline } from "react-icons/io5";
import { RiArrowLeftLine, RiFindReplaceLine, RiHome4Fill, RiMenu2Line, RiSearchLine } from "react-icons/ri";
import { CiLogout, CiSearch } from "react-icons/ci";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useLayoutEffect, useContext, useEffect } from "react";
import logo from "../../public/logo/logo.png";
import { BiDonateHeart, BiSolidDonateHeart } from "react-icons/bi";
import { MdBloodtype, MdPeople } from "react-icons/md";
import { HeartPulse, Search, Siren, SquarePen } from "lucide-react";
import { RxPerson } from "react-icons/rx";
import { AuthContext } from "../providers/AuthProviders";
import useRecentSearches from "../hooks/useRecentSearches";
import DonorCard from "./DonorCard";

const API_URL = import.meta.env.VITE_API_URL;

const TopNavbar = () => {
    const [open, setOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const menuRef = useRef(null);
    const navRef = useRef(null);
    const searchInputRef = useRef(null);
    const navigate = useNavigate();

    const [navHeight, setNavHeight] = useState(0);

    const { user, loading } = useContext(AuthContext);

    const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } =
        useRecentSearches();

    const [liveResults, setLiveResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");

    useLayoutEffect(() => {
        const updateHeight = () => setNavHeight(navRef.current?.offsetHeight || 0);
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    useEffect(() => {
        const trimmed = searchValue.trim();

        if (!trimmed) {
            setLiveResults([]);
            setSearchError("");
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setIsSearching(true);
            setSearchError("");
            try {
                const res = await fetch(`${API_URL}/donors?search=${encodeURIComponent(trimmed)}`, {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("There was a problem finding.");
                const data = await res.json();
                setLiveResults(data);
                setIsSearching(false);
            } catch (err) {
                if (err.name === "AbortError") return;
                setSearchError(err.message || "There was a problem finding.");
                setIsSearching(false);
            }
        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [searchValue]);

    const runSearch = (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;

        addRecentSearch(trimmed);
        searchInputRef.current?.blur();
        setSearchValue("");
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            runSearch(searchValue);
        }
    };

    const handleRecentSearchClick = (term) => {
        setSearchValue(term);
    };

    const showingLiveResults = searchValue.trim() !== "";

    return (
        <nav ref={navRef} className=" relative rounded-lg bg-white/80 backdrop-blur-3xl border-gray-200">
            <div className="relative flex justify-center items-center w-full px-3 sm:px-3 lg:px-3  shadow-sm gap-2 h-14">

                <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0 w-full ">

                    <button
                        onClick={() => setOpen(true)}
                        className="md:hidden shrink-0 p-2 rounded-md text-gray-800 hover:bg-gray-100 transition-all duration-300"
                    >
                        <RiMenu2Line className="text-xl" />
                    </button>

                    <NavLink
                        to="/"
                        className={`flex items-center gap-1.5 shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${isSearchFocused ? "md:max-w-0 md:opacity-0 md:-ml-2" : "max-w-[220px] opacity-100"
                            }`}
                    >
                        {/* <img className="w-8 sm:w-10 lg:w-12 h-auto shrink-0" src={logo} alt="Blood Find Logo" /> */}
                        <HeartPulse className="bg-red-500 text-white w-9 h-9 p-1.5 rounded-lg" />
                        <div className="lg:flex flex-col justify-center sm:block md:hidden">
                            <div className="text-base sm:text-lg lg:text-xl font-bold text-red-600 leading-tight whitespace-nowrap">
                                Blood Find
                            </div>
                            <div className="text-[10px] lg:text-[10px] font-medium text-gray-600 leading-tight whitespace-nowrap">
                                Global Blood Network
                            </div>
                        </div>
                    </NavLink>

                    <div
                        className={`hidden md:block relative min-w-0 transition-all duration-300 ease-in-out ${isSearchFocused
                            ? "flex-1 max-w-[280px] lg:max-w-[420px] xl:max-w-[500px]"
                            : "flex-1 max-w-[160px] lg:max-w-[240px] xl:max-w-[320px]"
                            }`}
                    >
                        <Search
                            className={`absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none ${isSearchFocused ? "hidden" : ""
                                } text-gray-600 w-5 z-10`}
                        />
                        <div className="flex flex-row gap-3">
                            <button
                                onClick={() => searchInputRef.current?.blur()}
                                className={`${isSearchFocused ? "shrink-0 p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors" : "hidden"
                                    }`}
                            >
                                <RiArrowLeftLine className="text-xl" />
                            </button>
                            <input
                                ref={searchInputRef}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className={`relative w-full min-w-0 ${isSearchFocused ? "px-3" : "px-9"
                                    } py-[7px] rounded-full border border-[#eaedf1] bg-[#f7f8f9] text-sm outline-none transition-all duration-200 focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100`}
                                type="search"
                                placeholder="Search blood group.."
                            />

                            {isSearchFocused && (
                                <div
                                    onMouseDown={(e) => e.preventDefault()}
                                    style={{ top: navHeight, maxHeight: `calc(100vh - ${navHeight}px)` }}
                                    className="fixed left-0 w-[92vw] sm:w-[420px] md:w-[460px] lg:w-[520px] max-w-[520px] overflow-y-auto bg-white shadow-lg z-40"
                                >
                                    {showingLiveResults ? (
                                        <div className="p-3">
                                            {isSearching ? (
                                                <div className="space-y-2">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
                                                    ))}
                                                </div>
                                            ) : searchError ? (
                                                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                                    {searchError}
                                                </p>
                                            ) : liveResults.length === 0 ? (
                                                <div className="flex flex-col items-center py-8 text-center">
                                                    <RiSearchLine className="mb-2 text-2xl text-gray-300" />
                                                    <p className="text-sm text-gray-500">No available donor</p>
                                                    <p className="text-xs text-gray-400">Please Try to Search another blood group, name, district..</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {liveResults.slice(0, 5).map((donor) => (
                                                        <DonorCard key={donor._id || donor.email} donor={donor} />
                                                    ))}
                                                    {liveResults.length > 5 && (
                                                        <button
                                                            onMouseDown={() => runSearch(searchValue)}
                                                            className="w-full rounded-lg py-2 text-center text-sm font-semibold text-red-600 hover:bg-red-50"
                                                        >
                                                            All {liveResults.length} donor See →
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
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
                                                        onClick={() => handleRecentSearchClick(item.name)}
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
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:flex items-center justify-center hidden">
                    <div className="flex flex-row py-0">
                        <ul className="flex gap-1 font-medium h-14">

                            <li className="h-full group relative">
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `flex h-full w-full flex-row items-center justify-center border-b-3 transition-colors ${isActive ? "border-red-600 text-red-600" : "border-transparent"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <div
                                            className={`flex items-center justify-center rounded-lg px-3 py-3 ${isActive ? "" : "hover:bg-[#F2F2F2]"
                                                }`}
                                        >
                                            <RiHome4Fill />
                                            <span className="ms-2">Home</span>
                                        </div>
                                    )}
                                </NavLink>

                                <span className="pointer-events-none absolute top-full mt-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    Home
                                </span>
                            </li>

                            <li className="h-full group relative">
                                <NavLink
                                    to="/blood-request"
                                    className={({ isActive }) =>
                                        `flex h-full w-full flex-row items-center justify-center border-b-3 transition-colors ${isActive ? "border-red-600 text-red-600" : "border-transparent"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <div
                                            className={`flex items-center justify-center rounded-lg px-2 py-3 ${isActive ? "" : "hover:bg-[#F2F2F2]"
                                                }`}
                                        >
                                            {/* <BiSolidDonateHeart /> */}
                                            <SquarePen className=" w-4.5 h-4.5" />
                                            <span className="ms-2">Create Request</span>
                                        </div>
                                    )}
                                </NavLink>

                                <span className="pointer-events-none absolute top-full mt-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    Create Requests
                                </span>
                            </li>
                            <li className="h-full group relative">
                                <NavLink
                                    to="/donate"
                                    className={({ isActive }) =>
                                        `flex h-full w-full flex-row items-center justify-center border-b-3 transition-colors ${isActive ? "border-red-600 text-red-600" : "border-transparent"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <div
                                            className={`flex items-center justify-center rounded-lg px-2 py-3 ${isActive ? "" : "hover:bg-[#F2F2F2]"
                                                }`}
                                        >
                                            <BiSolidDonateHeart />
                                            <span className="ms-2">Donate</span>
                                        </div>
                                    )}
                                </NavLink>

                                <span className="pointer-events-none absolute top-full mt-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    Donate
                                </span>
                            </li>

                            <li className="h-full group relative">
                                <NavLink
                                    to="/available-donors"
                                    className={({ isActive }) =>
                                        `flex h-full w-full flex-row items-center justify-center border-b-3 transition-colors ${isActive ? "border-red-600 text-red-600" : "border-transparent"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <div
                                            className={`flex items-center justify-center rounded-lg px-2 py-3 ${isActive ? "" : "hover:bg-[#F2F2F2]"
                                                }`}
                                        >
                                            <MdPeople className="text-lg" />
                                            <span className="ms-2">Available Donors</span>
                                        </div>
                                    )}
                                </NavLink>

                                <span className="pointer-events-none absolute top-full left-1/2 mt-0.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131] px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    Available Donors
                                </span>
                            </li>

                        </ul>
                    </div>
                </div>

                <div className="lg:flex-1 md:flex flex items-center justify-end gap-1.5 shrink-0">
                    <div className="flex">
                        {loading ? (
                            <div className=" w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        ) :
                            user ?

                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-red-600 text-base md:hidden lg:block block"
                                            : "text-inherit hover:text-red-500 text-base md:hidden lg:block block"
                                    }
                                >
                                    <h2 className="flex items-center gap-2 hover:underline ">
                                        <RxPerson />
                                        <span>{("Account")} </span>
                                    </h2>
                                </NavLink>
                                :
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-red-600 text-base "
                                            : "text-inherit hover:text-red-500 text-base "
                                    }
                                >
                                    <h2 className="flex items-center gap-2 hover:underline ">
                                        <RxPerson />
                                        <span>{("Login")} </span>
                                    </h2>
                                </NavLink>
                        }

                    </div>
                    <div>
                        <button
                            onClick={() => navigate("/search")}
                            className="md:hidden p-1 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <CiSearch className="text-3xl" />
                        </button>
                    </div>

                    <div>
                        <NavLink
                            to="/profile"
                            className="hidden md:block rounded-full text-gray-700 transition-colors"
                        >
                            <button className="flex">
                                {loading ? (
                                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                ) : !user ? (
                                    <IoPersonCircleOutline className="rounded-full p-1 w-10 h-10 hover:bg-gray-100" />
                                ) : user.photoURL ? (
                                    <img
                                        className="rounded-full p-1 w-10 h-10 hover:bg-gray-100 object-cover"
                                        src={user.photoURL}
                                        alt="Profile"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center text-lg font-semibold uppercase hover:bg-red-600">
                                        {user.displayName?.charAt(0) || "U"}
                                    </div>
                                )}
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/10 z-30 h-screen"
                    title="Close"
                />
            )}
            <div
                ref={menuRef}
                className={`lg:hidden fixed top-0 left-0 z-40 w-[250px] h-screen p-3 overflow-y-auto transition-transform duration-300 bg-gray-100
                    ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="shadow-[rgba(0,0,15,0.5)_0px_2px_0px_0px] shadow-gray-200">
                    <h5 className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-red-500 to-blue-500 font-semibold p-2">
                        <Link to='/'
                            onClick={() => setOpen(false)}
                        >
                            Blood Find BD
                        </Link>
                    </h5>
                </div>

                <button
                    onClick={() => setOpen(false)}
                    className="bg-gray-200 p-2 rounded-md text-blue-800 transition-all duration-500 absolute top-4 inset-e-2.5 hover:bg-gray-300"
                >
                    <IoCloseSharp className="text-xl" />
                </button>

                <div className="py-4 overflow-y-auto">
                    <ul className="space-y- font-medium">
                        <li>
                            <NavLink
                                to="/"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => isActive
                                    ?
                                    'flex p-2 py-2.5 items-center rounded-lg hover:bg-gray-200 w-full transition-colors text-red-600'
                                    :
                                    'flex p-2 py-2.5 items-center rounded-lg hover:bg-gray-200 w-full transition-colors'
                                }
                            >
                                <RiHome4Fill className={({ isActive }) => isActive
                                    ?
                                    "text-lg text-gray-600"
                                    :
                                    'text-lg text-red-600'
                                }
                                />
                                <span className="ms-2">Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/donate"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => isActive
                                    ?
                                    'flex p-2 py-2.5 items-center rounded-lg hover:bg-gray-200 w-full transition-colors text-red-600'
                                    :
                                    'flex p-2 py-2.5 items-center rounded-lg hover:bg-gray-200 w-full transition-colors'
                                }
                            >
                                <BiSolidDonateHeart
                                    className={({ isActive }) => isActive
                                        ?
                                        "text-lg text-gray-600"
                                        :
                                        'text-lg text-red-600'
                                    }
                                />
                                <span className="ms-2">Blood Donate</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/blood-request"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => isActive
                                    ?
                                    'flex p-2 py-2.5 items-center rounded-lg hover:bg-gray-200 w-full transition-colors text-red-600'
                                    :
                                    'flex p-2 py-2.5 items-center rounded-lg hover:bg-gray-200 w-full transition-colors'
                                }
                            >
                                <SquarePen className="w-4" />
                                <span className="ms-2">Create Blood Request</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/login"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => isActive
                                    ?
                                    'flex p-2 py-2.5 items-center rounded-lg hover:bg-gray-200 w-full transition-colors text-red-600'
                                    :
                                    'flex p-2 py-2.5 items-center rounded-lg hover:bg-gray-200 w-full transition-colors'
                                }
                            >
                                <CiLogout />
                                <span className="ms-2 whitespace-nowrap">Log Out</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default TopNavbar;