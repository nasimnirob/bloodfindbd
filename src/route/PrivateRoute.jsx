import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // AUTH LOADING
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-rose-50">
                <div className="flex flex-col items-center">

                    {/* Loading Spinner */}
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />

                    {/* Loading Text */}
                    <p className="mt-3 text-sm font-medium text-gray-500">
                        Checking your account...
                    </p>

                </div>
            </div>
        );
    }

    // USER LOGGED IN
    if (user) {
        return children;
    }

    // USER NOT LOGGED IN
    return (
        <Navigate
            to="/login"
            state={{ from: location }}
            replace
        />
    );
};

export default PrivateRoute;


// import { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../providers/AuthProviders";

// const PrivateRoute = ({ children }) => {
//     const { user, loading } = useContext(AuthContext);
//     const location = useLocation();

//     if (loading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
//             </div>
//         );
//     }

//     if (user) {
//         return children;
//     }

//     return (
//         <Navigate
//             to="/login"
//             state={{ from: location }}
//             replace
//         />
//     );
// };

// export default PrivateRoute;