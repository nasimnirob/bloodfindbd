import { useContext } from "react";

import { Navigate, useLocation, } from "react-router-dom";

import { AuthContext } from "../providers/AuthProviders";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    // console.log(location.pathname);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><span className="loading loading-dots loading-lg"></span></div>
    }

    if (user) {
        return children;
    }
    

    return <Navigate state={location.pathname} to="/login"></Navigate>;
};


export default PrivateRoute;