import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { AuthContext } from "../providers/AuthProviders";
import toast from "react-hot-toast";
import { RiArrowLeftLine } from "react-icons/ri";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const API_URL = import.meta.env.VITE_API_URL;

const CompleteProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        phone: "",
        bloodGroup: "",
        district: "",
        area: "",
        gender: "",
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/users/${encodeURIComponent(user.email)}`
                );

                if (res.status === 404) {
                    return;
                }

                if (!res.ok) {
                    throw new Error("Profile load failed");
                }

                const data = await res.json();

                setForm({
                    phone: data.phone || "",
                    bloodGroup: data.bloodGroup || "",
                    district: data.district || "",
                    area: data.area || "",
                    gender: data.gender || "",
                });
            } catch (err) {
                console.error("Profile fetch error:", err);
                toast.error("আগের profile data load করতে সমস্যা হয়েছে");
            }
        };

        fetchProfile();
    }, [user, navigate]);


    const districts = [
        "Bagerhat",
        "Bandarban",
        "Barguna",
        "Barishal",
        "Bhola",
        "Bogura",
        "Brahmanbaria",
        "Chandpur",
        "Chattogram",
        "Chuadanga",
        "Cox's Bazar",
        "Cumilla",
        "Dhaka",
        "Dinajpur",
        "Faridpur",
        "Feni",
        "Gaibandha",
        "Gazipur",
        "Gopalganj",
        "Habiganj",
        "Jamalpur",
        "Jashore",
        "Jhalokathi",
        "Jhenaidah",
        "Joypurhat",
        "Khagrachhari",
        "Khulna",
        "Kishoreganj",
        "Kurigram",
        "Kushtia",
        "Lakshmipur",
        "Lalmonirhat",
        "Madaripur",
        "Magura",
        "Manikganj",
        "Meherpur",
        "Moulvibazar",
        "Munshiganj",
        "Mymensingh",
        "Naogaon",
        "Narail",
        "Narayanganj",
        "Narsingdi",
        "Natore",
        "Netrokona",
        "Nilphamari",
        "Noakhali",
        "Pabna",
        "Panchagarh",
        "Patuakhali",
        "Pirojpur",
        "Rajbari",
        "Rajshahi",
        "Rangamati",
        "Rangpur",
        "Satkhira",
        "Shariatpur",
        "Sherpur",
        "Sirajganj",
        "Sunamganj",
        "Sylhet",
        "Tangail",
        "Thakurgaon",
    ];

    const handleBack = () => {
        navigate(-1);
    };

    // If someone lands here without being logged in, send them back
    if (!user) {
        navigate("/login");
        return null;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { phone, bloodGroup, district, area, gender } = form;
        if (!phone || !bloodGroup || !district) {
            setError("সব ফিল্ড পূরণ করুন");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/users/${encodeURIComponent(user.email)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success("প্রোফাইল সম্পূর্ণ হয়েছে");
            navigate("/profile");
        } catch (err) {
            setError(err.message || "প্রোফাইল সেভ করতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-0 md:py-12 py-6">
            <div className="flex flex-col justify-between gap-12 ">
                <div className="w-full md:hidden">
                    <button
                        onClick={handleBack}
                        className="shrink-0 p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <RiArrowLeftLine className="text-xl" />
                    </button>
                </div>
                <div className=" flex w-full items-center justify-center text-center text-lg md:mt-12 mt-0 text-rose-600">
                    <p>আপনার প্রোফাইল সম্পূর্ণ হয়নাই, দয়াকরে সঠিক তথ্য দিয়ে প্রোফাইল সম্পূর্ণ করেন </p>
                </div>
            </div>
            <div className=" flex md:min-h-[calc(100vh-15rem)] min-h-[calc(100vh-18rem)] items-center justify-center bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 py-12">
                <div className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-5 shadow-[0_8px_30px_rgba(220,38,38,0.08)]">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        {/* {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName}
                                className="mx-auto mb-4 h-14 w-14 rounded-full border-4 border-red-100 object-cover"
                            />
                        ) : (
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl font-bold text-white shadow-lg shadow-red-200">
                                {user.displayName?.charAt(0) || "U"}
                            </div>
                        )} */}
                        <h1 className="text-2xl font-extrabold text-gray-900">
                            Congratulations, {user.displayName?.split(" ")[0]}!
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            ডোনার হিসেবে সাহায্য করার জন্য এই তথ্যগুলো প্রয়োজন।
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Phone + Blood group */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Phone <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <HiOutlinePhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Blood Group <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="bloodGroup"
                                    value={form.bloodGroup}
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

                        {/* District + Area */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    District <span className="text-red-600">*</span>
                                </label>

                                <div className="relative">
                                    <HiOutlineLocationMarker className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

                                    <select
                                        name="district"
                                        value={form.district}
                                        onChange={handleChange}
                                        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                    >
                                        <option value="">Select District</option>

                                        {districts.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Area
                                </label>
                                <input
                                    type="text"
                                    name="area"
                                    value={form.area}
                                    onChange={handleChange}
                                    placeholder="Dhanmondi"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Complete Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;