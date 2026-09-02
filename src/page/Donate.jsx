// import { useContext, useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { RiSearchLine, RiCloseLine, RiTimeLine } from "react-icons/ri";
// import { AuthContext } from "../providers/AuthProviders";
// import { HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";

// const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
// const API_URL = import.meta.env.VITE_API_URL;

// const districts = [
//     "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura",
//     "Brahmanbaria", "Chandpur", "Chattogram", "Chuadanga", "Cox's Bazar",
//     "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha",
//     "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi",
//     "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj",
//     "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur",
//     "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
//     "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
//     "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
//     "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur",
//     "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet",
//     "Tangail", "Thakurgaon",
// ];

// const BloodBadge = ({ group }) => (
//     <div className="w-14 h-16 shrink-0">
//         <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-sm" fill="#dc2626">
//             <path d="M50 0 C75 25 95 45 95 70 A45 45 0 1 1 5 70 C5 45 25 25 50 0Z" />
//             <text x="50" y="68" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
//                 {group}
//             </text>
//         </svg>
//     </div>
// );

// const timeAgo = (dateStr) => {
//     const diffMs = Date.now() - new Date(dateStr).getTime();
//     const mins = Math.floor(diffMs / 60000);
//     if (mins < 1) return "এইমাত্র";
//     if (mins < 60) return `${mins} মিনিট আগে`;
//     const hours = Math.floor(mins / 60);
//     if (hours < 24) return `${hours} ঘণ্টা আগে`;
//     const days = Math.floor(hours / 24);
//     return `${days} দিন আগে`;
// };

// const RequestCard = ({ request }) => (
//     <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
//         <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0 flex-1">
//                 <div className="flex items-center gap-2">
//                     <p className="truncate font-semibold text-gray-900">{request.patientName}</p>
//                     {request.urgency === "urgent" && (
//                         <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
//                             URGENT
//                         </span>
//                     )}
//                 </div>

//                 {request.hospital && (
//                     <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
//                         <HiOutlineHospital className="shrink-0 text-base" />
//                         {request.hospital}
//                     </p>
//                 )}

//                 <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
//                     <HiOutlineLocationMarker className="shrink-0 text-base" />
//                     {request.area}{request.area && request.district ? ", " : ""}{request.district}
//                 </p>

//                 <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
//                     <RiTimeLine className="shrink-0" />
//                     {timeAgo(request.createdAt)} · {request.unitsNeeded} unit{request.unitsNeeded !== 1 ? "s" : ""} প্রয়োজন
//                 </p>

//                 <a
//                     href={`tel:${request.contactPhone}`}
//                     className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
//                 >
//                     <HiOutlinePhone className="text-sm" />
//                     Call & Help
//                 </a>
//             </div>

//             <BloodBadge group={request.bloodGroup} />
//         </div>
//     </div>
// );

// const Donate = () => {
//     const { user } = useContext(AuthContext);
//     const [searchParams, setSearchParams] = useSearchParams();
//     const [requests, setRequests] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [bloodGroup, setBloodGroup] = useState(searchParams.get("group") || "");
//     const [district, setDistrict] = useState(searchParams.get("district") || "");

//     useEffect(() => {
//         const controller = new AbortController();

//         const fetchRequests = async () => {
//             setIsLoading(true);
//             setError("");
//             try {
//                 const params = new URLSearchParams();
//                 params.set("status", "open");
//                 if (bloodGroup) params.set("bloodGroup", bloodGroup);
//                 if (district) params.set("district", district);

//                 const res = await fetch(`${API_URL}/blood-requests?${params.toString()}`, {
//                     signal: controller.signal,
//                 });
//                 if (!res.ok) throw new Error("রিকোয়েস্ট লোড করতে সমস্যা হয়েছে");
//                 const data = await res.json();
//                 setRequests(data);
//                 setIsLoading(false);
//             } catch (err) {
//                 if (err.name === "AbortError") return;
//                 setError(err.message || "রিকোয়েস্ট লোড করতে সমস্যা হয়েছে");
//                 setIsLoading(false);
//             }
//         };

//         fetchRequests();

//         const params = {};
//         if (bloodGroup) params.group = bloodGroup;
//         if (district) params.district = district;
//         setSearchParams(params, { replace: true });

//         return () => controller.abort();
//     }, [bloodGroup, district]);

//     const hasFilters = Boolean(bloodGroup || district);

//     return (
//         <div className="md:min-h-screen min-h-[calc(100vh-20rem)] bg-gradient-to-b from-rose-50 via-rose-50/60 to-white">
//             {/* Fixed Filter Bar */}
//             <div className="fixed top-14 left-0 right-0 z-10 border-b border-gray-200/70 bg-[#F2F4F7]/95 backdrop-blur-md">
//                 <div className="mx-auto max-w-[700px] px-3 py-2">
//                     <div className="mb-3 px-0.5 flex items-center justify-between">
//                         <div>
//                             <h1 className="text-xl font-extrabold text-gray-900">I Want to Donate</h1>
//                             <p className="text-xs text-gray-500">
//                                 {user?.displayName ? `${user.displayName.split(" ")[0]}, ` : ""}
//                                 তোমার আশেপাশের প্রয়োজন খুঁজে বের করো
//                             </p>
//                         </div>
//                         {hasFilters && (
//                             <button
//                                 onClick={() => {
//                                     setBloodGroup("");
//                                     setDistrict("");
//                                 }}
//                                 className="flex shrink-0 items-center gap-1 rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-300"
//                             >
//                                 <RiCloseLine className="text-sm" />
//                                 Clear
//                             </button>
//                         )}
//                     </div>

//                     <div className="flex flex-col md:flex-row items-start justify-between gap-4 lg:gap-1 md:gap-2 w-full">
//                         {/* Blood group chips */}
//                         <div className="grid grid-cols-4 min-[374px]:grid-cols-8 gap-2 w-full px-0">
//                             {bloodGroups.map((bg) => {
//                                 const active = bloodGroup === bg;
//                                 return (
//                                     <button
//                                         key={bg}
//                                         onClick={() => setBloodGroup(active ? "" : bg)}
//                                         className={`w-full rounded-full px-2 py-2 text-sm font-bold transition ${active
//                                             ? "bg-red-600 text-white shadow-md shadow-red-200"
//                                             : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-red-50 hover:text-red-600"
//                                             }`}
//                                     >
//                                         {bg}
//                                     </button>
//                                 );
//                             })}
//                         </div>

//                         {/* District */}
//                         <div className="relative w-full md:w-auto min-w-[180px]">
//                             <HiOutlineLocationMarker className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                             <select
//                                 value={district}
//                                 onChange={(e) => setDistrict(e.target.value)}
//                                 className="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
//                             >
//                                 <option value="">Select District</option>
//                                 {districts.map((d) => (
//                                     <option key={d} value={d}>
//                                         {d}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {!isLoading && !error && (
//                         <p className="mt-3 text-xs font-medium text-gray-400">
//                             {requests.length} request{requests.length !== 1 ? "s" : ""} need blood
//                             {bloodGroup && <> · <span className="text-red-600">{bloodGroup}</span></>}
//                             {district && <> · {district}</>}
//                         </p>
//                     )}
//                 </div>
//             </div>

//             {/* Results */}
//             <div className="mx-auto min-h-[calc(100vh-3.5rem)] flex max-w-[700px] px-4 pb-5">
//                 {isLoading ? (
//                     <div className="space-y-3 md:pt-38 pt-52 max-[374px]:pt-64 w-full">
//                         {[1, 2, 3].map((i) => (
//                             <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/70 shadow-sm" />
//                         ))}
//                     </div>
//                 ) : error ? (
//                     <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 md:pt-38 pt-52 max-[374px]:pt-64">
//                         {error}
//                     </p>
//                 ) : requests.length === 0 ? (
//                     <div className="space-y-3 md:pt-38 pt-52 max-[374px]:pt-64 md:flex items-center justify-center w-full">
//                         <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 text-center py-16 w-full">
//                             <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
//                                 <RiSearchLine className="text-2xl text-gray-400" />
//                             </div>
//                             <p className="text-sm font-medium text-gray-600">এই মুহূর্তে কোনো রিকোয়েস্ট নেই</p>
//                             <p className="mt-1 text-xs text-gray-400">অন্য blood group বা district try করে দেখো</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="space-y-3 md:pt-38 pt-52 max-[374px]:pt-64 w-full">
//                         {requests.map((request) => (
//                             <RequestCard key={request._id} request={request} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Donate;






import { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    RiSearchLine,
    RiCloseLine,
    RiTimeLine,
    RiEqualizerLine,
    RiNavigationLine,
    RiMapPinLine,
} from "react-icons/ri";

import { AuthContext } from "../providers/AuthProviders";
import { Hospital } from "lucide-react";
import { HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";
import RequestCard from "../component/RequestCard";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const API_URL = import.meta.env.VITE_API_URL;
const RADIUS_OPTIONS = [5, 10, 20, 50, 100];

const districts = [
    "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura",
    "Brahmanbaria", "Chandpur", "Chattogram", "Chuadanga", "Cox's Bazar",
    "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha",
    "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi",
    "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj",
    "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur",
    "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
    "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
    "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
    "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur",
    "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet",
    "Tangail", "Thakurgaon",
];


// const timeAgo = (dateStr) => {
//     const diffMs = Date.now() - new Date(dateStr).getTime();
//     const mins = Math.floor(diffMs / 60000);
//     if (mins < 1) return "এইমাত্র";
//     if (mins < 60) return `${mins} মিনিট আগে`;
//     const hours = Math.floor(mins / 60);
//     if (hours < 24) return `${hours} ঘণ্টা আগে`;
//     const days = Math.floor(hours / 24);
//     return `${days} দিন আগে`;
// };

// Haversine formula — straight-line distance between two lat/lng points, in km
const distanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// const RequestCard = ({ request, distance }) => (
//     <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
//         <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0 flex-1">
//                 <div className="flex items-center gap-2">
//                     <p className="truncate font-semibold text-gray-900">{request.patientName}</p>
//                     {request.urgency === "urgent" && (
//                         <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
//                             URGENT
//                         </span>
//                     )}
//                     {distance != null && (
//                         <span className="shrink-0 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-600">
//                             {distance < 1 ? "< 1 km" : `${distance.toFixed(1)} km`}
//                         </span>
//                     )}
//                 </div>

//                 {request.hospital && (
//                     <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
//                         <Hospital className="shrink-0 text-base" />
//                         {request.hospital}
//                     </p>
//                 )}

//                 <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
//                     <HiOutlineLocationMarker className="shrink-0 text-base" />
//                     {request.area}{request.area && request.district ? ", " : ""}{request.district}
//                 </p>

//                 <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
//                     <RiTimeLine className="shrink-0" />
//                     {timeAgo(request.createdAt)} · {request.unitsNeeded} unit{request.unitsNeeded !== 1 ? "s" : ""} প্রয়োজন
//                 </p>

//                 <div className="mt-3 flex flex-wrap items-center gap-2">
//                     <a
//                         href={`tel:${request.contactPhone}`}
//                         className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
//                     >
//                         <HiOutlinePhone className="text-sm" />
//                         Call & Help
//                     </a>

//                     {/* Opens the hospital's exact pinned location directly in Google Maps — no API key needed, just a deep link */}
//                     {request.location?.lat && request.location?.lng && (
//                         <a
//                             href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
//                         >
//                             <RiMapPinLine className="text-sm" />
//                             Live Location
//                         </a>
//                     )}
//                 </div>
//             </div>

//             <BloodBadge group={request.bloodGroup} />
//         </div>
//     </div>
// );

const Donate = () => {
    const { user } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const [allRequests, setAllRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [bloodGroup, setBloodGroup] = useState(searchParams.get("group") || "");
    const [district, setDistrict] = useState(searchParams.get("district") || "");

    // "Near me" location filter
    const [nearMe, setNearMe] = useState(false);
    const [radiusKm, setRadiusKm] = useState(20);
    const [userCoords, setUserCoords] = useState(null);
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState("");

    // Fetch open requests filtered by blood group / district (server-side)
    useEffect(() => {
        const controller = new AbortController();

        const fetchRequests = async () => {
            setIsLoading(true);
            setError("");
            try {
                const params = new URLSearchParams();
                params.set("status", "open");
                if (bloodGroup) params.set("bloodGroup", bloodGroup);
                if (district) params.set("district", district);

                const res = await fetch(`${API_URL}/blood-requests?${params.toString()}`, {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("রিকোয়েস্ট লোড করতে সমস্যা হয়েছে");
                const data = await res.json();
                setAllRequests(data);
                setIsLoading(false);
            } catch (err) {
                if (err.name === "AbortError") return;
                setError(err.message || "রিকোয়েস্ট লোড করতে সমস্যা হয়েছে");
                setIsLoading(false);
            }
        };

        fetchRequests();

        const params = {};
        if (bloodGroup) params.group = bloodGroup;
        if (district) params.district = district;
        setSearchParams(params, { replace: true });

        return () => controller.abort();
    }, [bloodGroup, district]);

    // const handleEnableNearMe = () => {
    //     setLocationError("");
    //     if (!navigator.geolocation) {
    //         setLocationError("তোমার ব্রাউজার লোকেশন সাপোর্ট করে না");
    //         return;
    //     }
    //     setLocating(true);
    //     navigator.geolocation.getCurrentPosition(
    //         (pos) => {
    //             setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    //             setNearMe(true);
    //             setLocating(false);
    //         },
    //         () => {
    //             setLocationError("লোকেশন পাওয়া যায়নি — permission দিয়েছো কিনা চেক করো");
    //             setLocating(false);
    //         }
    //     );
    // };


    const handleEnableNearMe = async () => {
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationError("তোমার ব্রাউজার লোকেশন সাপোর্ট করে না");
            return;
        }

        try {
            const permission = await navigator.permissions.query({
                name: "geolocation",
            });

            if (permission.state === "denied") {
                setLocationError(
                    "Location permission blocked আছে। Browser Settings থেকে Location → Allow করে আবার চেষ্টা করো।"
                );
                return;
            }
        } catch (err) {
            console.log(err);
        }

        setLocating(true);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserCoords({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });

                setNearMe(true);
                setLocating(false);
            },
            (error) => {
                setLocating(false);

                if (error.code === error.PERMISSION_DENIED) {
                    setLocationError(
                        "Location permission blocked আছে। Browser Settings থেকে Location → Allow করে আবার চেষ্টা করো।"
                    );
                } else {
                    setLocationError("লোকেশন পাওয়া যায়নি। আবার চেষ্টা করো।");
                }
            }
        );
    };


    // Client-side: attach distance to each request, then filter/sort by it when "near me" is active
    const visibleRequests = useMemo(() => {
        if (!nearMe || !userCoords) {
            return allRequests.map((r) => ({ request: r, distance: null }));
        }

        return allRequests
            .filter((r) => r.location?.lat && r.location?.lng)
            .map((r) => ({
                request: r,
                distance: distanceKm(userCoords.lat, userCoords.lng, r.location.lat, r.location.lng),
            }))
            .filter((item) => item.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);
    }, [allRequests, nearMe, userCoords, radiusKm]);

    const activeFilterCount = [bloodGroup, district, nearMe].filter(Boolean).length;

    const clearAll = () => {
        setBloodGroup("");
        setDistrict("");
        setNearMe(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white">
            <div className="mx-auto max-w-[700px] px-4 pb-5 pt-6">
                {/* Header */}
                <div className="mb-4 text-center">
                    {/* <h1 className="text-2xl font-extrabold text-gray-900">I Want to Donate</h1> */}
                    <p className="mt-1 text-sm text-gray-500">
                        {user?.displayName ? `${user.displayName.split(" ")[0]}, ` : ""}
                        “রক্ত দাও, জীবন বাঁচাও—মানবতার পাশে দাঁড়াও।”
                    </p>
                </div>

                {/* Compact filter summary bar */}
                <div className="mb-3 flex items-center gap-2">
                    <button
                        onClick={() => setFiltersOpen((prev) => !prev)}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${filtersOpen || activeFilterCount > 0
                            ? "border-red-200 bg-red-50 text-red-600"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <RiEqualizerLine />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {!isLoading && !error && (
                        <p className="text-xs font-medium text-gray-400">
                            {visibleRequests.length} request{visibleRequests.length !== 1 ? "s" : ""} found
                        </p>
                    )}
                </div>

                {/* Active filter pills */}
                {activeFilterCount > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        {bloodGroup && (
                            <button
                                onClick={() => setBloodGroup("")}
                                className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200"
                            >
                                {bloodGroup} <RiCloseLine />
                            </button>
                        )}
                        {district && (
                            <button
                                onClick={() => setDistrict("")}
                                className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200"
                            >
                                {district} <RiCloseLine />
                            </button>
                        )}
                        {nearMe && (
                            <button
                                onClick={() => setNearMe(false)}
                                className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200"
                            >
                                📍 {radiusKm} km এর মধ্যে <RiCloseLine />
                            </button>
                        )}
                        <button
                            onClick={clearAll}
                            className="text-xs font-semibold text-red-600 hover:underline"
                        >
                            সব মুছুন
                        </button>
                    </div>
                )}

                {/* Collapsible filter panel */}
                {filtersOpen && (
                    <div className="mb-4 space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        {/* Blood group */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-800">Blood Group</p>
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                                {bloodGroups.map((bg) => {
                                    const active = bloodGroup === bg;
                                    return (
                                        <button
                                            key={bg}
                                            onClick={() => setBloodGroup(active ? "" : bg)}
                                            className={`rounded-lg py-2 text-sm font-bold transition ${active
                                                ? "bg-red-600 text-white shadow-sm"
                                                : "bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-red-50 hover:text-red-600"
                                                }`}
                                        >
                                            {bg}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* District */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-800">District</p>
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                            >
                                <option value="">Select District</option>
                                {districts.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Near me */}
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-800">দূরত্ব অনুযায়ী খুঁজো</p>

                            {!nearMe ? (
                                <button
                                    onClick={handleEnableNearMe}
                                    disabled={locating}
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                                >
                                    <RiNavigationLine className="text-red-600" />
                                    {locating ? "লোকেশন নেওয়া হচ্ছে..." : "তোমার কাছাকাছি খুঁজো"}
                                </button>
                            ) : (
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-emerald-700">
                                            📍 তোমার লোকেশন থেকে {radiusKm} km এর মধ্যে
                                        </p>
                                        <button
                                            onClick={() => setNearMe(false)}
                                            className="text-xs font-semibold text-gray-500 hover:underline"
                                        >
                                            বন্ধ করো
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {RADIUS_OPTIONS.map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRadiusKm(r)}
                                                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${radiusKm === r
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-white text-emerald-700 ring-1 ring-emerald-200"
                                                    }`}
                                            >
                                                {r} km
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {locationError && (
                                <p className="mt-2 text-xs text-red-500">{locationError}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Results */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 rounded-2xl bg-white/70 shadow-sm" />
                        ))}
                    </div>
                ) : error ? (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </p>
                ) : visibleRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 py-16 text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <RiSearchLine className="text-2xl text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                            {nearMe
                                ? "এই দূরত্বের মধ্যে কোনো লাইভ-লোকেশন রিকোয়েস্ট নেই"
                                : "এই মুহূর্তে কোনো রিকোয়েস্ট নেই"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">অন্য filter দিয়ে try করে দেখো</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {visibleRequests.map(({ request, distance }) => (
                            <RequestCard key={request._id} request={request} distance={distance} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Donate;