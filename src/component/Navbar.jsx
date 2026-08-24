import { BookOpen, SquarePen } from "lucide-react";
import { useContext } from "react";
import { BiSolidDonateHeart } from "react-icons/bi";
import { MdBloodtype, MdOutlineManageAccounts, MdPeople } from "react-icons/md";
import { RiHome4Fill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";

const Navbar = () => {
    const { user, loading } = useContext(AuthContext);

    return (
        <div className="fixed bottom-0 left-1/2 z-50 h-14 w-full max-w-[767px] -translate-x-1/2 border border-gray-200 bg-white shadow-lg shadow-stone-200 md:hidden">
            <div className="mx-auto grid h-full max-w-lg grid-cols-5">

                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                ) : (
                    <div className="group relative h-full w-full">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `flex h-full w-full flex-col items-center justify-center gap-0.5 border-t-2 transition-colors ${isActive
                                    ? "border-red-600 text-red-600"
                                    : "border-transparent text-gray-600 hover:bg-[#F2F2F2]"
                                }`
                            }
                        >
                            <RiHome4Fill className="text-2xl" />
                            <span className="sr-only">Home</span>
                        </NavLink>

                        {/* Tooltip */}
                        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Home
                        </span>
                    </div>
                )}

                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                ) : (
                    <div className="group relative h-full w-full">
                        <NavLink
                            to="/donate"
                            className={({ isActive }) =>
                                `flex h-full w-full flex-col items-center justify-center gap-0.5 border-t-2 transition-colors ${isActive
                                    ? "border-red-600 text-red-600"
                                    : "border-transparent text-gray-600 hover:bg-[#F2F2F2]"
                                }`
                            }
                        >
                            {/* <MdBloodtype className="text-2xl" /> */}
                            <BiSolidDonateHeart className="text-2xl" />
                            <span className="sr-only">Blood Donate</span>
                        </NavLink>

                        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Donate
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-center bg-white">
                    {loading ? (
                        <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : (
                        <div className="group relative h-full w-full flex items-center justify-center mb-2">
                            <NavLink
                                to="/blood-request"
                                className={({ isActive }) =>
                                    `flex h-12 w-12 items-center justify-center rounded-full transition-colors border border-red-200 ${isActive
                                        ? "bg-red-600 text-white"
                                        : "bg-red-100 text-red-600 hover:bg-red-200"
                                    }`
                                }
                            >
                                <SquarePen className="text-3xl" />
                                <span className="sr-only">Create Post</span>
                            </NavLink>
                            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                Create Request
                            </span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                ) : (
                    <div className="group relative h-full w-full">
                        <NavLink
                            to="/available-donors"
                            className={({ isActive }) =>
                                `flex h-full w-full flex-col items-center justify-center gap-0.5 border-t-2 transition-colors ${isActive
                                    ? "border-red-600 text-red-600"
                                    : "border-transparent text-gray-600 hover:bg-[#F2F2F2]"
                                }`
                            }
                        >
                            <MdPeople className="text-2xl" />
                            <span className="sr-only">Available Donor</span>
                        </NavLink>
                        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Available Donor
                        </span>
                    </div>
                    // <div className="group relative h-full w-full">
                    //     <NavLink
                    //         to="/blood-information"
                    //         className={({ isActive }) =>
                    //             `flex h-full w-full flex-col items-center justify-center gap-0.5 border-t-2 transition-colors ${isActive
                    //                 ? "border-red-600 text-red-600"
                    //                 : "border-transparent text-gray-600 hover:bg-[#F2F2F2]"
                    //             }`
                    //         }
                    //     >
                    //         <BookOpen className="text-2xl" />
                    //         <span className="sr-only">Blood Information</span>
                    //     </NavLink>
                    //     <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    //         Blood Information
                    //     </span>
                    // </div>
                )}

                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                ) : (
                    <div className="group relative h-full w-full">
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `flex h-full w-full flex-col items-center justify-center gap-0.5 border-t-2 transition-colors ${isActive
                                    ? "border-red-600 text-red-600"
                                    : "border-transparent text-gray-600 hover:bg-[#F2F2F2]"
                                }`
                            }
                        >
                            {!user ? (
                                <MdOutlineManageAccounts className="text-2xl" />
                            ) : user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    referrerPolicy="no-referrer"
                                    className="h-7 w-7 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-semibold uppercase">
                                    {user.displayName?.charAt(0) || "U"}
                                </div>
                            )}
                            <span className="sr-only">Profile</span>
                        </NavLink>
                        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#303131]  px-2 py-1 text-xs text-[#DEE0E4] shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Profile
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Navbar;