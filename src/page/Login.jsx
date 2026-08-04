import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { HeartPulse } from "lucide-react";
import { AuthContext } from "../providers/AuthProviders";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { googleLogin } = useContext(AuthContext)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("সব ফিল্ড পূরণ করুন");
            return;
        }

        try {
            setLoading(true);

            // TODO: replace with actual API call
            // const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(formData),
            // });
            // const data = await res.json();
            // if (!res.ok) throw new Error(data.message);

            navigate("/");
        } catch (err) {
            setError(err.message || "লগইন করতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };


    const handleGoogle = () => {

        googleLogin()
            .then(result => {
                console.log(result.user)

                // nagigate
                navigate(location?.state ? location.state : '/');
            })
            .catch(error => {
                console.error(error);

            })

    };

    return (
        <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 ">
            <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-[0_8px_30px_rgba(220,38,38,0.08)]">
                {/* Header */}
                <div className="mb-8 text-center">
                    <NavLink
                        to="/"
                        className={`flex items-center justify-center gap-1.5 shrink-0 overflow-hidden transition-all duration-300 ease-in-out `}
                    >
                        <HeartPulse className="bg-red-500 text-white w-10 h-10 p-1.5 rounded-lg" />

                    </NavLink>
                    <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Login to continue saving lives
                    </p>
                    <hr className="my-2 text-gray-200" />
                    <div className="">
                        <button onClick={handleGoogle} className="border border-red-600 btn relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group">
                            <span className="w-48 h-48 rounded rotate-[-40deg] bg-red-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                            <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">Continue With Google</span>
                        </button>
                    </div>
                    <hr className="my-2 text-gray-200" />
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    {/* Password */}
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs font-medium text-red-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
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

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400">OR</span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Register link */}
                <p className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="font-semibold text-red-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
