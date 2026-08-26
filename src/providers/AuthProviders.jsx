import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, updateProfile, getAuth, } from "firebase/auth";

import app from "../firebase/firebase.config";
const auth = getAuth(app);

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register with email & password
    const createUser = (email, password) => {
        setLoading(true);

        try {

            return createUserWithEmailAndPassword(auth, email, password);
        }
        finally {
            setLoading(false);
        }
    };

    // Login with email & password
    const signIn = async (email, password) => {
        setLoading(true);

        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } finally {
            setLoading(false);
        }
    };

    // Google login
    const googleSignIn = () => {
        setLoading(true);
        try {
            return signInWithPopup(auth, googleProvider);
        }
        finally {
            setLoading(false);
        }
    };

    // Update name / photo on the firebase user object
    const updateUserProfile = (profileInfo) => {
        return updateProfile(auth.currentUser, profileInfo);
    };

    // Send email verification link
    const verifyEmail = () => {
        return sendEmailVerification(auth.currentUser);
    };

    // Forgot password
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Logout
    const logOut = () => {
        setLoading(true);
        try {
            return signOut(auth);
        }
        finally {
            setLoading(false);
        }
    };


    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         console.log('user State change', currentUser);
    //         setUser(currentUser);
    //         setLoading(false);
    //     });

    //     return () => unsubscribe();
    // }, []);


    useEffect(() => {
        let isMounted = true;

        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {
                if (!isMounted) return;

                console.log("User state changed:", currentUser);

                setUser(currentUser);
                setLoading(false);
            },
            (error) => {
                console.error("Firebase Auth Error:", error);

                if (!isMounted) return;

                setUser(null);
                setLoading(false);
            }
        );

        // Firebase initialization
        const timeout = setTimeout(() => {
            if (!isMounted) return;

            console.warn("Firebase Auth initialization timeout");

            setLoading(false);
        }, 3000);

        return () => {
            isMounted = false;
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);


    const authInfo = { user, loading, createUser, signIn, googleSignIn, updateUserProfile, verifyEmail, resetPassword, logOut, };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;
// if (loading) {
//     return (
//         <div className="flex min-h-screen items-center justify-center">
//             <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
//         </div>
//     );
// }