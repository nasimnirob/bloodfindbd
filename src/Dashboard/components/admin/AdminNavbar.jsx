const AdminNavbar = ({ setOpen }) => {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur md:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setOpen(true)}
                    className="rounded-lg p-2 text-xl hover:bg-gray-100 lg:hidden"
                >
                    ☰
                </button>

                <div>
                    <h1 className="text-lg font-bold text-gray-900">
                        Admin Dashboard
                    </h1>

                    <p className="hidden text-xs text-gray-400 sm:block">
                        Manage Blood Find BD
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative rounded-xl p-2 text-xl hover:bg-gray-100">
                    🔔
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="hidden h-9 w-px bg-gray-200 sm:block" />

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                        A
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">
                            Administrator
                        </p>

                        <p className="text-xs text-gray-400">
                            Super Admin
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;