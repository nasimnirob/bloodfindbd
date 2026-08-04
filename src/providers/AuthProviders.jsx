// import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
// import { useEffect } from "react";
// import { useState } from "react";
// import { createContext } from "react";
// import app from "../firebase/firebase.config";
// // import { getAuth } from "firebase/auth";

// export const AuthContext = createContext(null);
// const auth = getAuth(app);
// const providerGoogle = new GoogleAuthProvider;

// const AuthProviders = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const createUser = (email, password) => {
//         setLoading(true);
//         return createUserWithEmailAndPassword(auth, email, password)
//     }

//     const signIn = (email, password) => {
//         setLoading(true);
//         return signInWithEmailAndPassword(auth, email, password)
//     }

//     const logOut = () => {
//         setLoading(true);
//         return signOut(auth);
//     }

//     const googleLogin = () => {
//         setLoading(true);
//         return signInWithPopup(auth, providerGoogle);

//     }

//     useEffect(() => {
//         const unSubcribe = onAuthStateChanged(auth, presentUser => {
//             console.log('user State change', presentUser);
//             setUser(presentUser);
//             setLoading(false)
//         });
//         return () => {
//             unSubcribe();
//         }
//     }, [])

//     const info = {
//         user, loading, logOut, googleLogin, signIn, createUser,
//     }

//     return (
//         <AuthContext.Provider value={info}>
//             {children}
//         </AuthContext.Provider>
//     )

// };

// export default AuthProviders;




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
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login with email & password
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Google login
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
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
        return signOut(auth);
    };

    // Keep user state in sync with firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('user State change', currentUser);
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = { user, loading, createUser, signIn, googleSignIn, updateUserProfile, verifyEmail, resetPassword, logOut, };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;