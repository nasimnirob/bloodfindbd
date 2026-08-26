import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProviders";


const API_URL = import.meta.env.VITE_API_URL;

const AdminRoute = () => {
    const { user, loading: authLoading } =
        useContext(AuthContext);

    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            if (authLoading) return;

            if (!user?.email) {
                setAllowed(false);
                setChecking(false);
                return;
            }

            try {
                const res = await fetch(
                    `${API_URL}/users/${encodeURIComponent(
                        user.email
                    )}`
                );

                if (!res.ok) {
                    setAllowed(false);
                    return;
                }

                const data = await res.json();

                if (
                    data.role === "admin" ||
                    data.role === "superAdmin"
                ) {
                    setAllowed(true);
                } else {
                    setAllowed(false);
                }

            } catch (error) {
                console.error(
                    "Admin check error:",
                    error
                );

                setAllowed(false);

            } finally {
                setChecking(false);
            }
        };

        checkAdmin();
    }, [user, authLoading]);


    if (authLoading || checking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">
                    Checking access...
                </p>
            </div>
        );
    }


    if (!user) {
        return <Navigate to="/login" replace />;
    }


    if (!allowed) {
        return <Navigate to="/" replace />;
    }


    return <Outlet />;
};

export default AdminRoute;