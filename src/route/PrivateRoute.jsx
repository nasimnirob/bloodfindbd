import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
            </div>
        );
    }

    if (user) {
        return children;
    }

    return (
        <Navigate
            to="/login"
            state={{ from: location }}
            replace
        />
    );
};

export default PrivateRoute;