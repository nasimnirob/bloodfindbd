// import { useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
// import { FcGoogle } from "react-icons/fc";
// import {
//     HiOutlineMail,
//     HiOutlineLockClosed,
//     HiOutlineUser,
//     HiOutlinePhone,
// } from "react-icons/hi";
// import useAuth from "../hooks/useAuth";
// import { HeartPulse } from "lucide-react";
// import toast from "react-hot-toast";

// const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
// const API_URL = import.meta.env.VITE_API_URL;

// const Register = () => {
//     const { createUser, googleSignIn, updateUserProfile } = useAuth();
//     const navigate = useNavigate();

//     const [step, setStep] = useState(1); // 1 = details, 2 = OTP verify
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [otp, setOtp] = useState("");

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         bloodGroup: "",
//         password: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // Step 1: validate details, then ask the backend to email a real OTP
//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         setError("");

//         const { name, email, phone, bloodGroup, password } = formData;
//         if (!name || !email || !phone || !bloodGroup || !password) {
//             setError("সব ফিল্ড পূরণ করুন");
//             return;
//         }
//         if (password.length < 6) {
//             setError("পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে");
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await fetch(`${API_URL}/send-otp`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email }),
//             });
//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.message);
//             }

//             setStep(2);
//         } catch (err) {
//             setError(err.message || "OTP পাঠাতে সমস্যা হয়েছে");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Step 2: verify OTP with the backend, then create the Firebase account + DB profile
//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (otp.length !== 6) {
//             setError("৬ ডিজিটের OTP দিন");
//             return;
//         }

//         try {
//             setLoading(true);

//             // 1. verify the OTP against the backend
//             const verifyRes = await fetch(`${API_URL}/verify-otp`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email: formData.email, otp }),
//             });
//             const verifyData = await verifyRes.json();

//             if (!verifyRes.ok) {
//                 throw new Error(verifyData.message);
//             }

//             // 2. OTP confirmed -> create the actual Firebase auth account
//             await createUser(formData.email, formData.password);
//             await updateUserProfile({ displayName: formData.name });

//             // 3. save the rest of the profile (phone, bloodGroup, etc.) to MongoDB
//             const userRes = await fetch(`${API_URL}/users`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData),
//             });

//             if (!userRes.ok) {
//                 const userData = await userRes.json();
//                 throw new Error(userData.message);
//             }

//             navigate("/");
//             toast.success('Register Successfully');
//         } catch (err) {
//             setError(mapError(err));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleResendOtp = async () => {
//         setError("");
//         try {
//             setLoading(true);
//             const res = await fetch(`${API_URL}/send-otp`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email: formData.email }),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message);
//             setError("");
//         } catch (err) {
//             setError(err.message || "OTP আবার পাঠাতে সমস্যা হয়েছে");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleGoogle = async () => {
//         setError("");
//         try {
//             setLoading(true);
//             const result = await googleSignIn();
//             const user = result.user;

//             // Google accounts are already verified — create the DB profile directly
//             await fetch(`${API_URL}/users`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     name: user.displayName,
//                     email: user.email,
//                     photoURL: user.photoURL,
//                 }),
//             }).catch(() => {
//                 // if this email already exists in the DB (e.g. logged in before), ignore
//             });

//             navigate("/");
//         } catch (err) {
//             setError(mapError(err));
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 py-12">
//             <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-6 shadow-[0_8px_30px_rgba(220,38,38,0.08)]">
//                 {/* Header */}

//                 <div className="mb- text-center">
//                     <NavLink
//                         to="/"
//                         className={`flex items-center gap-1.5 shrink-0 overflow-hidden transition-all duration-300 ease-in-out  justify-center`}
//                     >
//                         <HeartPulse className="bg-red-500 text-white w-10 h-10 p-1.5 rounded-lg" />

//                     </NavLink>
//                     <h1 className="text-2xl font-extrabold text-gray-900">
//                         {step === 1 ? "Create Account" : "Verify Email"}
//                     </h1>
//                     <p className="mt-1 text-sm text-gray-500">
//                         {step === 1
//                             ? "Join the network, save lives"
//                             : `আমরা ${formData.email} এ একটি কোড পাঠিয়েছি`}
//                     </p>
//                     <p className="my-6 text-gray-200" ></p>
//                     <div className="">
//                         <button onClick={handleGoogle} className="border border-red-600 btn relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white cursor-pointer group">
//                             <span className="w-48 h-48 rounded rotate-[-40deg] bg-red-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
//                             <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Continue With Google</span>
//                         </button>
//                     </div>
//                     <div className="my-6 flex items-center gap-3">
//                         <div className="h-px flex-1 bg-gray-200" />
//                         <span className="text-xs text-gray-400">OR</span>
//                         <div className="h-px flex-1 bg-gray-200" />
//                     </div>
//                 </div>

//                 {/* Step indicator */}
//                 <div className="mb-6 flex items-center gap-2">
//                     <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-red-600" : "bg-gray-200"}`} />
//                     <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-red-600" : "bg-gray-200"}`} />
//                 </div>

//                 {error && (
//                     <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
//                         {error}
//                     </div>
//                 )}

//                 {step === 1 ? (
//                     <>
//                         <form onSubmit={handleSendOtp} className="space-y-4">
//                             {/* Name */}
//                             <div>
//                                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                     Full Name
//                                 </label>
//                                 <div className="relative">
//                                     <HiOutlineUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         placeholder="Your full name"
//                                         className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Email */}
//                             <div>
//                                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                     Email
//                                 </label>
//                                 <div className="relative">
//                                     <HiOutlineMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         placeholder="you@example.com"
//                                         className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Phone + Blood group */}
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                         Phone
//                                     </label>
//                                     <div className="relative">
//                                         <HiOutlinePhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
//                                         <input
//                                             type="tel"
//                                             name="phone"
//                                             value={formData.phone}
//                                             onChange={handleChange}
//                                             placeholder="01XXXXXXXXX"
//                                             className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                         Blood Group
//                                     </label>
//                                     <select
//                                         name="bloodGroup"
//                                         value={formData.bloodGroup}
//                                         onChange={handleChange}
//                                         className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                     >
//                                         <option value="">Select</option>
//                                         {bloodGroups.map((bg) => (
//                                             <option key={bg} value={bg}>
//                                                 {bg}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Password */}
//                             <div>
//                                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                     Password
//                                 </label>
//                                 <div className="relative">
//                                     <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         placeholder="••••••••"
//                                         className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword((prev) => !prev)}
//                                         className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                     >
//                                         {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="mt-2 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
//                             >
//                                 {loading ? "Sending OTP..." : "Continue"}
//                             </button>
//                         </form>

//                         <div className="my-6 flex items-center gap-3">
//                             <div className="h-px flex-1 bg-gray-200" />
//                             <span className="text-xs text-gray-400">OR</span>
//                             <div className="h-px flex-1 bg-gray-200" />
//                         </div>

//                         {/* <button
//                             onClick={handleGoogleSignup}
//                             disabled={loading}
//                             type="button"
//                             className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             <FcGoogle className="text-lg" />
//                             Continue with Google
//                         </button> */}

//                         <p className="mt-6 text-center text-sm text-gray-500">
//                             Already have an account?{" "}
//                             <Link to="/login" className="font-semibold text-red-600 hover:underline">
//                                 Login
//                             </Link>
//                         </p>
//                     </>
//                 ) : (
//                     <form onSubmit={handleVerifyOtp} className="space-y-4">
//                         <div>
//                             <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                 Verification Code
//                             </label>
//                             <input
//                                 type="text"
//                                 inputMode="numeric"
//                                 maxLength={6}
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                                 placeholder="000000"
//                                 className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             {loading ? "Verifying..." : "Verify & Create Account"}
//                         </button>

//                         <div className="flex items-center justify-between text-sm">
//                             <button
//                                 type="button"
//                                 onClick={() => setStep(1)}
//                                 className="text-gray-500 hover:underline"
//                             >
//                                 ← Back
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={handleResendOtp}
//                                 disabled={loading}
//                                 className="font-semibold text-red-600 hover:underline disabled:opacity-60"
//                             >
//                                 Resend code
//                             </button>
//                         </div>
//                     </form>
//                 )}
//             </div>
//         </div>
//     );
// };

// // Turn firebase / backend error messages into user-friendly Bangla text
// function mapError(err) {
//     const code = err?.code;
//     switch (code) {
//         case "auth/email-already-in-use":
//             return "এই ইমেইল দিয়ে আগেই একাউন্ট আছে";
//         case "auth/invalid-email":
//             return "ইমেইল সঠিক না";
//         case "auth/weak-password":
//             return "পাসওয়ার্ড দুর্বল, আরো শক্তিশালী পাসওয়ার্ড দিন";
//         default:
//             return err?.message || "একাউন্ট তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন";
//     }
// }

// export default Register;





import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlinePhone,
} from "react-icons/hi";
import useAuth from "../hooks/useAuth";
import { HeartPulse } from "lucide-react";
import toast from "react-hot-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
    const { createUser, googleSignIn, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1 = details, 2 = OTP verify
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [otp, setOtp] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        bloodGroup: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Step 1: validate details, then ask the backend to email a real OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");

        const { name, email, phone, bloodGroup, password } = formData;
        if (!name || !email || !phone || !bloodGroup || !password) {
            setError("সব ফিল্ড পূরণ করুন");
            return;
        }
        if (password.length < 6) {
            setError("পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setStep(2);
        } catch (err) {
            setError(err.message || "OTP পাঠাতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: verify OTP with the backend, then create the Firebase account + DB profile
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            setError("৬ ডিজিটের OTP দিন");
            return;
        }

        try {
            setLoading(true);

            // 1. verify the OTP against the backend
            const verifyRes = await fetch(`${API_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                throw new Error(verifyData.message);
            }

            // 2. OTP confirmed -> create the actual Firebase auth account
            await createUser(formData.email, formData.password);
            await updateUserProfile({ displayName: formData.name });

            // 3. save the rest of the profile (phone, bloodGroup, etc.) to MongoDB
            const userRes = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!userRes.ok) {
                const userData = await userRes.json();
                throw new Error(userData.message);
            }

            navigate("/");
            toast.success('Register Successfully');
        } catch (err) {
            setError(mapError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError("");
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setError("");
        } catch (err) {
            setError(err.message || "OTP আবার পাঠাতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    // Google sign-in: Firebase only gives us name + email + photo.
    // Blood group / phone / district / gender it can NEVER give us — so a
    // brand-new Google account is routed to /complete-profile to collect them
    // before a MongoDB user document is created.
    const handleGoogle = async () => {
        setError("");
        try {
            setLoading(true);
            const result = await googleSignIn();
            const user = result.user;

            // Check whether this Google account already has a Blood Find BD profile
            const existsRes = await fetch(`${API_URL}/users/${encodeURIComponent(user.email)}/exists`);
            const existsData = await existsRes.json();

            if (existsData.exists) {
                // returning user — already completed bloodGroup/district/etc earlier
                toast.success("সফলভাবে লগইন হয়েছে");
                navigate("/");
                return;
            }

            // first time with this Google account — create the DB record RIGHT NOW
            // (with just what Firebase gave us), then send them to fill in the rest
            await fetch(`${API_URL}/users/social`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                }),
            });

            toast(
                "স্বাগতম! ব্লাড ডোনার নেটওয়ার্কে যুক্ত হতে আর একটু তথ্য দরকার — ব্লাড গ্রুপ, জেলা আর ফোন নম্বর।",
                {
                    icon: "🩸",
                    duration: 4500,
                    style: {
                        background: "#fef2f2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                    },
                }
            );
            navigate("/complete-profile");
        } catch (err) {
            setError(mapError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 py-12">
            <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-6 shadow-[0_8px_30px_rgba(220,38,38,0.08)]">
                {/* Header */}

                <div className="mb- text-center">
                    <NavLink
                        to="/"
                        className={`flex items-center gap-1.5 shrink-0 overflow-hidden transition-all duration-300 ease-in-out  justify-center`}
                    >
                        <HeartPulse className="bg-red-500 text-white w-10 h-10 p-1.5 rounded-lg" />

                    </NavLink>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        {step === 1 ? "Create Account" : "Verify Email"}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {step === 1
                            ? "Join the network, save lives"
                            : `আমরা ${formData.email} এ একটি কোড পাঠিয়েছি`}
                    </p>
                    <p className="my-6 text-gray-200" ></p>
                    <div className="">
                        <button
                            onClick={handleGoogle}
                            disabled={loading}
                            className="border border-red-600 btn relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white cursor-pointer group disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span className="w-48 h-48 rounded rotate-[-40deg] bg-red-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                            <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                                {loading ? "..." : "Continue With Google"}
                            </span>
                        </button>
                    </div>
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                </div>

                {/* Step indicator */}
                <div className="mb-6 flex items-center gap-2">
                    <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-red-600" : "bg-gray-200"}`} />
                    <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-red-600" : "bg-gray-200"}`} />
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <>
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <HiOutlineUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="relative">
                                    <HiOutlineMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                    />
                                </div>
                            </div>

                            {/* Phone + Blood group */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <div className="relative">
                                        <HiOutlinePhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="01XXXXXXXXX"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Blood Group
                                    </label>
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                    >
                                        <option value="">Select</option>
                                        {bloodGroups.map((bg) => (
                                            <option key={bg} value={bg}>
                                                {bg}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Sending OTP..." : "Continue"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-red-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                placeholder="000000"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Verifying..." : "Verify & Create Account"}
                        </button>

                        <div className="flex items-center justify-between text-sm">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-gray-500 hover:underline"
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="font-semibold text-red-600 hover:underline disabled:opacity-60"
                            >
                                Resend code
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// Turn firebase / backend error messages into user-friendly Bangla text
function mapError(err) {
    const code = err?.code;
    switch (code) {
        case "auth/email-already-in-use":
            return "এই ইমেইল দিয়ে আগেই একাউন্ট আছে";
        case "auth/invalid-email":
            return "ইমেইল সঠিক না";
        case "auth/weak-password":
            return "পাসওয়ার্ড দুর্বল, আরো শক্তিশালী পাসওয়ার্ড দিন";
        default:
            return err?.message || "একাউন্ট তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন";
    }
}

export default Register;







// import { useContext, useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
// import {
//     HiOutlineMail,
//     HiOutlineLockClosed,
//     HiOutlineUser,
//     HiOutlinePhone,
// } from "react-icons/hi";
// import { HeartPulse } from "lucide-react";
// import { AuthContext } from "../providers/AuthProviders";

// const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// const Register = () => {
//     const navigate = useNavigate();

//     const [step, setStep] = useState(1); // 1 = details, 2 = OTP verify
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [otp, setOtp] = useState("");

//     const { googleLogin } = useContext(AuthContext)

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         bloodGroup: "",
//         password: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     console.log(formData);

//     // Step 1: submit details -> send OTP to email
//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         setError("");

//         const { name, email, phone, bloodGroup, password } = formData;
//         if (!name || !email || !phone || !bloodGroup || !password) {
//             setError("সব ফিল্ড পূরণ করুন");
//             return;
//         }
//         if (password.length < 6) {
//             setError("পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে");
//             return;
//         }

//         try {
//             setLoading(true);

//             // TODO: replace with actual API call
//             // const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
//             //     method: "POST",
//             //     headers: { "Content-Type": "application/json" },
//             //     body: JSON.stringify({ email: formData.email }),
//             // });
//             // const data = await res.json();
//             // if (!res.ok) throw new Error(data.message);

//             setStep(2);
//         } catch (err) {
//             setError(err.message || "OTP পাঠাতে সমস্যা হয়েছে");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Step 2: verify OTP -> create account
//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         setError("");

//         if (otp.length !== 6) {
//             setError("৬ ডিজিটের OTP দিন");
//             return;
//         }

//         try {
//             setLoading(true);

//             // TODO: replace with actual API call
//             // const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
//             //     method: "POST",
//             //     headers: { "Content-Type": "application/json" },
//             //     body: JSON.stringify({ ...formData, otp }),
//             // });
//             // const data = await res.json();
//             // if (!res.ok) throw new Error(data.message);

//             navigate("/login");
//         } catch (err) {
//             setError(err.message || "OTP ভেরিফাই করতে সমস্যা হয়েছে");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handleGoogle = () => {

//         googleLogin()
//             .then(result => {
//                 console.log(result.user)

//                 // nagigate
//                 navigate(location?.state ? location.state : '/');
//             })
//             .catch(error => {
//                 console.error(error);

//             })

//     };

//     return (
//         <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 py-12">
//             <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-[0_8px_30px_rgba(220,38,38,0.08)]">
//                 {/* Header */}
// <div className="mb-8 text-center">
//     <NavLink
//         to="/"
//         className={`flex items-center gap-1.5 shrink-0 overflow-hidden transition-all duration-300 ease-in-out  justify-center`}
//     >
//         <HeartPulse className="bg-red-500 text-white w-10 h-10 p-1.5 rounded-lg" />

//     </NavLink>
//     <h1 className="text-2xl font-extrabold text-gray-900">
//         {step === 1 ? "Create Account" : "Verify Email"}
//     </h1>
//     <p className="mt-1 text-sm text-gray-500">
//         {step === 1
//             ? "Join the network, save lives"
//             : `আমরা ${formData.email} এ একটি কোড পাঠিয়েছি`}
//     </p>
//     <hr className="my-2 text-gray-200" />
//     <p className="text-sm pb-2">Easy to Create Account</p>
//     <div className="">
//         <button onClick={handleGoogle} className="border border-red-600 btn relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white cursor-pointer group">
//             <span className="w-48 h-48 rounded rotate-[-40deg] bg-red-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
//             <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Continue With Google</span>
//         </button>
//     </div>
//     <hr className="my-2 text-gray-200" />
// </div>

//                 {/* Step indicator */}
//                 <div className="mb-6 flex items-center gap-2">
//                     <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-red-600" : "bg-gray-200"}`} />
//                     <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-red-600" : "bg-gray-200"}`} />
//                 </div>

//                 {error && (
//                     <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
//                         {error}
//                     </div>
//                 )}

//                 {step === 1 ? (
//                     <form onSubmit={handleSendOtp} className="space-y-4">
//                         {/* Name */}
//                         <div>
//                             <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                 Full Name
//                             </label>
//                             <div className="relative">
//                                 <HiOutlineUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     placeholder="Your full name"
//                                     className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                 />
//                             </div>
//                         </div>

//                         {/* Email */}
//                         <div>
//                             <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                 Email
//                             </label>
//                             <div className="relative">
//                                 <HiOutlineMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="you@example.com"
//                                     className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                 />
//                             </div>
//                         </div>

//                         {/* Phone + Blood group */}
//                         <div className="grid grid-cols-2 gap-3">
//                             <div>
//                                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                     Phone
//                                 </label>
//                                 <div className="relative">
//                                     <HiOutlinePhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
//                                     <input
//                                         type="tel"
//                                         name="phone"
//                                         value={formData.phone}
//                                         onChange={handleChange}
//                                         placeholder="01XXXXXXXXX"
//                                         className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                     Blood Group
//                                 </label>
//                                 <select
//                                     name="bloodGroup"
//                                     value={formData.bloodGroup}
//                                     onChange={handleChange}
//                                     className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                 >
//                                     <option value="">Select</option>
//                                     {bloodGroups.map((bg) => (
//                                         <option key={bg} value={bg}>
//                                             {bg}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Password */}
//                         <div>
//                             <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     placeholder="••••••••"
//                                     className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword((prev) => !prev)}
//                                     className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                 >
//                                     {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//                                 </button>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="mt-2 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             {loading ? "Sending OTP..." : "Continue"}
//                         </button>
//                     </form>
//                 ) : (
//                     <form onSubmit={handleVerifyOtp} className="space-y-4">
//                         <div>
//                             <label className="mb-1.5 block text-sm font-medium text-gray-700">
//                                 Verification Code
//                             </label>
//                             <input
//                                 type="text"
//                                 inputMode="numeric"
//                                 maxLength={6}
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                                 placeholder="000000"
//                                 className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-lg font-semibold tracking-[0.5em] text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             {loading ? "Verifying..." : "Verify & Create Account"}
//                         </button>

//                         <button
//                             type="button"
//                             onClick={() => setStep(1)}
//                             className="w-full text-center text-sm text-gray-500 hover:underline"
//                         >
//                             ← Back to edit details
//                         </button>
//                     </form>
//                 )}

//                 {/* Login link */}
//                 <p className="mt-6 text-center text-sm text-gray-500">
//                     Already have an account?{" "}
//                     <Link to="/login" className="font-semibold text-red-600 hover:underline">
//                         Login
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Register;
