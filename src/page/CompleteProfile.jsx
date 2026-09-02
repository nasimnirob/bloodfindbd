import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HiOutlinePhone,
    HiOutlineLocationMarker,
} from "react-icons/hi";
import { AuthContext } from "../providers/AuthProviders";
import toast from "react-hot-toast";
import { RiArrowLeftLine } from "react-icons/ri";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const API_URL = import.meta.env.VITE_API_URL;

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

const CompleteProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);

    const [error, setError] = useState("");
    const [locationError, setLocationError] = useState("");

    const [locationStatus, setLocationStatus] = useState("unknown");

    // Location name that will be shown in UI
    const [locationName, setLocationName] = useState("");

    const [form, setForm] = useState({
        phone: "",
        bloodGroup: "",
        district: "",
        area: "",
        gender: "",
        location: null,
    });

    // =========================================================
    // Load Existing Profile
    // =========================================================

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
                    location: data.location || null,
                });

                // If location already exists
                if (data.location?.coordinates) {
                    const [lng, lat] = data.location.coordinates;

                    // Try to get location name again
                    getLocationName(lat, lng);
                }
            } catch (err) {
                console.error("Profile fetch error:", err);

                toast.error(
                    "আগের profile data load করতে সমস্যা হয়েছে"
                );
            }
        };

        fetchProfile();
    }, [user, navigate]);

    // =========================================================
    // Check Browser Location Permission
    // =========================================================

    useEffect(() => {
        const checkLocationPermission = async () => {
            if (!navigator.permissions) {
                setLocationStatus("unknown");
                return;
            }

            try {
                const permission =
                    await navigator.permissions.query({
                        name: "geolocation",
                    });

                setLocationStatus(permission.state);

                permission.onchange = () => {
                    setLocationStatus(permission.state);
                };
            } catch (err) {
                console.log(
                    "Location permission check failed:",
                    err
                );
            }
        };

        checkLocationPermission();
    }, []);

    // =========================================================
    // Reverse Geocoding
    // Latitude + Longitude → Location Name
    // =========================================================

    const getLocationName = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!res.ok) {
                throw new Error(
                    "Reverse geocoding failed"
                );
            }

            const data = await res.json();

            const address = data.address || {};

            // Area / locality
            const area =
                address.suburb ||
                address.neighbourhood ||
                address.quarter ||
                address.village ||
                address.town ||
                address.city_district ||
                "";

            // District / city
            const district =
                address.city ||
                address.county ||
                address.state_district ||
                address.state ||
                "";

            // Create readable location name
            const name = [area, district]
                .filter(Boolean)
                .join(", ");

            setLocationName(
                name || "Current location"
            );

            // -------------------------------------------------
            // Automatically fill District
            // -------------------------------------------------

            if (district) {
                const matchedDistrict =
                    districts.find(
                        (item) =>
                            item.toLowerCase() ===
                            district.toLowerCase()
                    );

                if (matchedDistrict) {
                    setForm((prev) => ({
                        ...prev,
                        district:
                            matchedDistrict,
                    }));
                }
            }

            // -------------------------------------------------
            // Automatically fill Area
            // -------------------------------------------------

            if (area) {
                setForm((prev) => ({
                    ...prev,
                    area,
                }));
            }

            return {
                area,
                district,
                displayName: name,
            };
        } catch (error) {
            console.error(
                "Reverse geocoding error:",
                error
            );

            setLocationName(
                "Current location"
            );

            return null;
        }
    };

    // =========================================================
    // Back Button
    // =========================================================

    const handleBack = () => {
        navigate(-1);
    };

    // =========================================================
    // Normal Input Change
    // =========================================================

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // =========================================================
    // Get Current Location
    // =========================================================

    const handleGetCurrentLocation = async () => {
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationError(
                "তোমার ব্রাউজার লোকেশন সাপোর্ট করে না।"
            );

            return;
        }

        // -----------------------------------------------------
        // Check Browser Permission
        // -----------------------------------------------------

        try {
            if (navigator.permissions) {
                const permission =
                    await navigator.permissions.query({
                        name: "geolocation",
                    });

                setLocationStatus(
                    permission.state
                );

                if (
                    permission.state ===
                    "denied"
                ) {
                    setLocationError(
                        "Location permission blocked আছে। Browser Settings থেকে এই website-এর Location → Allow করে আবার চেষ্টা করো।"
                    );

                    return;
                }
            }
        } catch (err) {
            console.log(
                "Permission check not supported:",
                err
            );
        }

        // -----------------------------------------------------
        // Start Location
        // -----------------------------------------------------

        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    // -------------------------------------------------
                    // MongoDB GeoJSON Point
                    // IMPORTANT:
                    // [longitude, latitude]
                    // -------------------------------------------------

                    const locationData = {
                        type: "Point",
                        coordinates: [
                            longitude,
                            latitude,
                        ],
                    };

                    // Save location in form
                    setForm((prev) => ({
                        ...prev,
                        location:
                            locationData,
                    }));

                    setLocationStatus(
                        "granted"
                    );

                    // -------------------------------------------------
                    // Reverse Geocode
                    // GPS → Area + District
                    // -------------------------------------------------

                    await getLocationName(
                        latitude,
                        longitude
                    );

                    setLocationError("");

                    toast.success(
                        "আপনার current location নেওয়া হয়েছে"
                    );
                } catch (err) {
                    console.error(
                        "Location processing error:",
                        err
                    );

                    setLocationError(
                        "Location process করতে সমস্যা হয়েছে।"
                    );
                } finally {
                    setLocating(false);
                }
            },

            (error) => {
                setLocating(false);

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {
                    setLocationStatus(
                        "denied"
                    );

                    setLocationError(
                        "Location permission দেওয়া হয়নি। Browser Settings থেকে Location → Allow করে আবার চেষ্টা করো।"
                    );
                } else if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {
                    setLocationError(
                        "বর্তমানে আপনার location পাওয়া যাচ্ছে না। GPS/Location চালু আছে কিনা চেক করো।"
                    );
                } else if (
                    error.code ===
                    error.TIMEOUT
                ) {
                    setLocationError(
                        "Location পেতে বেশি সময় লাগছে। আবার চেষ্টা করো।"
                    );
                } else {
                    setLocationError(
                        "Location পাওয়া যায়নি। আবার চেষ্টা করো।"
                    );
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    // =========================================================
    // Remove Location
    // =========================================================

    const handleRemoveLocation = () => {
        setForm((prev) => ({
            ...prev,
            location: null,
        }));

        setLocationName("");
        setLocationError("");

        toast.success(
            "Location সরিয়ে দেওয়া হয়েছে"
        );
    };

    // =========================================================
    // Submit
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const {
            phone,
            bloodGroup,
            district,
            area,
            gender,
            location,
        } = form;

        // Required fields
        if (
            !phone ||
            !bloodGroup ||
            !district
        ) {
            setError(
                "Phone, Blood Group এবং District পূরণ করুন"
            );

            return;
        }

        // Bangladesh phone validation
        const phoneRegex =
            /^01[3-9]\d{8}$/;

        if (!phoneRegex.test(phone)) {
            setError(
                "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন"
            );

            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${API_URL}/users/${encodeURIComponent(
                    user.email
                )}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        phone,
                        bloodGroup,
                        district,
                        area,
                        gender,
                        location,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                        "Profile update failed"
                );
            }

            toast.success(
                "প্রোফাইল সম্পূর্ণ হয়েছে ❤️"
            );

            navigate("/profile");
        } catch (err) {
            console.error(
                "Profile update error:",
                err
            );

            setError(
                err.message ||
                    "প্রোফাইল সেভ করতে সমস্যা হয়েছে"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // If User Not Logged In
    // =========================================================

    if (!user) {
        navigate("/login");
        return null;
    }

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-0 py-6 md:py-12">

            {/* Mobile Back Button */}
            <div className="w-full md:hidden">
                <button
                    onClick={handleBack}
                    className="shrink-0 rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100"
                >
                    <RiArrowLeftLine className="text-xl" />
                </button>
            </div>

            {/* Welcome Text */}
            <div className="flex w-full items-center justify-center px-4 text-center text-lg text-rose-600 md:mt-12">
                <p>
                    স্বাগতম! ব্লাড ডোনার নেটওয়ার্কে
                    যুক্ত হতে নিচের তথ্য গুলো পূরণ
                    করুন। 💕
                </p>
            </div>

            {/* Form Container */}
            <div className="flex min-h-[calc(100vh-18rem)] w-full items-center justify-center bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 py-12 md:min-h-[calc(100vh-15rem)]">

                <div className="w-full max-w-lg rounded-2xl border border-red-100 p-4 shadow-[0_8px_30px_rgba(220,38,38,0.08)]">

                    {/* General Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* ========================================= */}
                        {/* Phone + Blood Group */}
                        {/* ========================================= */}

                        <div className="grid grid-cols-2 gap-3">

                            {/* Phone */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Phone{" "}
                                    <span className="text-red-600">
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <HiOutlinePhone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="01XXXXXXXXX"
                                        maxLength={
                                            11
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                    />
                                </div>
                            </div>

                            {/* Blood Group */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Blood Group{" "}
                                    <span className="text-red-600">
                                        *
                                    </span>
                                </label>

                                <select
                                    name="bloodGroup"
                                    value={
                                        form.bloodGroup
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="">
                                        Select
                                    </option>

                                    {bloodGroups.map(
                                        (bg) => (
                                            <option
                                                key={bg}
                                                value={
                                                    bg
                                                }
                                            >
                                                {bg}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* ========================================= */}
                        {/* District + Area */}
                        {/* ========================================= */}

                        <div className="grid grid-cols-2 gap-3">

                            {/* District */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    District{" "}
                                    <span className="text-red-600">
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <HiOutlineLocationMarker className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

                                    <select
                                        name="district"
                                        value={
                                            form.district
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                    >
                                        <option value="">
                                            Select District
                                        </option>

                                        {districts.map(
                                            (
                                                district
                                            ) => (
                                                <option
                                                    key={
                                                        district
                                                    }
                                                    value={
                                                        district
                                                    }
                                                >
                                                    {
                                                        district
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>

                            {/* Area */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Area
                                </label>

                                <input
                                    type="text"
                                    name="area"
                                    value={
                                        form.area
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Dhanmondi"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                />
                            </div>
                        </div>

                        {/* ========================================= */}
                        {/* Current Location */}
                        {/* ========================================= */}

                        <div>

                            <div className="mb-1.5 flex items-center justify-between">

                                <label className="block text-sm font-medium text-gray-700">
                                    Current Location
                                </label>

                                <span className="text-xs text-gray-400">
                                    Optional
                                </span>

                            </div>

                            {/* No Location */}
                            {!form.location ? (
                                <button
                                    type="button"
                                    onClick={
                                        handleGetCurrentLocation
                                    }
                                    disabled={
                                        locating
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <HiOutlineLocationMarker className="text-lg" />

                                    {locating
                                        ? "Location নেওয়া হচ্ছে..."
                                        : "Use Current Location"}
                                </button>
                            ) : (
                                /* Location Added */
                                <div className="rounded-xl border border-green-200 bg-green-50 p-3">

                                    <div className="flex items-center justify-between gap-3">

                                        <div className="flex min-w-0 items-center gap-2">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                                                <HiOutlineLocationMarker className="text-lg text-green-600" />
                                            </div>

                                            <div className="min-w-0">

                                                <p className="text-sm font-semibold text-green-700">
                                                    Location Added
                                                </p>

                                                <p className="truncate text-xs text-green-600">
                                                    {locationName ||
                                                        (form.area
                                                            ? `${form.area}, ${form.district}`
                                                            : form.district) ||
                                                        "Current location"}
                                                </p>

                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveLocation
                                            }
                                            className="shrink-0 text-xs font-medium text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>

                                    </div>
                                </div>
                            )}

                            {/* Location Error */}
                            {locationError && (
                                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                                    <p className="text-xs leading-5 text-red-600">
                                        {
                                            locationError
                                        }
                                    </p>
                                </div>
                            )}

                            {/* Permission Blocked Help */}
                            {locationStatus ===
                                "denied" &&
                                !form.location && (
                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        Location blocked থাকলে
                                        browser-এর address bar
                                        থেকে Site Settings →
                                        Location → Allow করে
                                        আবার চেষ্টা করুন।
                                    </p>
                                )}

                            {/* Location Info */}
                            {!form.location &&
                                !locationError && (
                                    <p className="mt-2 text-xs leading-5 text-gray-400">
                                        কাছাকাছি blood donor খুঁজে
                                        পেতে আপনার current location
                                        ব্যবহার করা হবে।
                                    </p>
                                )}

                        </div>

                        {/* ========================================= */}
                        {/* Gender */}
                        {/* ========================================= */}

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={
                                    form.gender
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                            >
                                <option value="">
                                    Select
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        {/* ========================================= */}
                        {/* Submit */}
                        {/* ========================================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Saving..."
                                : "Complete Profile"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfile;
