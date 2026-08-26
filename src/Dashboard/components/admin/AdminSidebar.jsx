import { HeartPulse } from "lucide-react";
import { AiOutlineUser } from "react-icons/ai";
import { MdBloodtype, MdDashboard, MdOutlineBloodtype, MdOutlineDashboard, MdOutlineVerifiedUser, MdVerifiedUser } from "react-icons/md";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ open, setOpen }) => {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <MdOutlineDashboard></MdOutlineDashboard>,
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: <AiOutlineUser></AiOutlineUser>,
        },
        {
            name: "Blood Requests",
            path: "/admin/blood-requests",
            icon: <MdOutlineBloodtype></MdOutlineBloodtype>,
        },
    ];

    return (
        <>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex h-20 items-center border-b border-gray-100 px-6">
                    <NavLink to='/'>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-xl text-white">
                                <HeartPulse className="bg-red-500 text-white w-9 h-9 p-1.5 rounded-lg" />
                            </div>

                            <div>
                                <h1 className="font-bold text-gray-900">
                                    Blood Find BD
                                </h1>

                                <p className="text-xs text-gray-400">
                                    Admin Panel
                                </p>
                            </div>
                        </div>
                    </NavLink>
                </div>

                {/* Menu */}
                <nav className="flex-1 space-y-2 p-4">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Main Menu
                    </p>

                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                    ? "bg-red-50 text-red-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="border-t border-gray-100 p-4">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600">
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;