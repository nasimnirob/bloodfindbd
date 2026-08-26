import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";


const AdminLayout = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar
                open={open}
                setOpen={setOpen}
            />

            <div className="lg:ml-64">
                <AdminNavbar setOpen={setOpen} />

                <main className="p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;