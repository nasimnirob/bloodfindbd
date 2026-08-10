// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { RxPerson } from "react-icons/rx";
// import { RiSearchLine, RiCloseLine } from "react-icons/ri";
// import { HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

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

// const DonorCard = ({ donor }) => (
//     <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
//         {donor.photoURL ? (
//             <img
//                 src={donor.photoURL}
//                 alt={donor.name}
//                 referrerPolicy="no-referrer"
//                 className="h-12 w-12 shrink-0 rounded-full border border-gray-100 object-cover"
//             />
//         ) : (
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-400">
//                 <RxPerson className="text-2xl" />
//             </div>
//         )}

//         <div className="min-w-0 flex-1">
//             <p className="truncate font-semibold text-gray-900">{donor.name || "Unnamed Donor"}</p>
//             <p className="truncate text-sm text-gray-500">
//                 {donor.area}{donor.area && donor.district ? ", " : ""}{donor.district}
//             </p>
//             <a
//                 href={`tel:${donor.phone}`}
//                 className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
//             >
//                 <HiOutlinePhone className="text-sm" />
//                 Request
//             </a>
//         </div>

//         <BloodBadge group={donor.bloodGroup} />
//     </div>
// );

// const AvailableDonors = () => {
//     const [searchParams, setSearchParams] = useSearchParams();
//     const [donors, setDonors] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [bloodGroup, setBloodGroup] = useState(searchParams.get("group") || "");
//     const [district, setDistrict] = useState(searchParams.get("district") || "");

//     useEffect(() => {
//         const fetchDonors = async () => {
//             setIsLoading(true);
//             setError("");
//             try {
//                 const params = new URLSearchParams();
//                 if (bloodGroup) params.set("bloodGroup", bloodGroup);
//                 if (district) params.set("district", district);

//                 const res = await fetch(`${API_URL}/donors?${params.toString()}`);
//                 if (!res.ok) throw new Error("ডোনার লোড করতে সমস্যা হয়েছে");
//                 const data = await res.json();
//                 setDonors(data);
//             } catch (err) {
//                 setError(err.message || "ডোনার লোড করতে সমস্যা হয়েছে");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchDonors();

//         const params = {};
//         if (bloodGroup) params.group = bloodGroup;
//         if (district) params.district = district;
//         setSearchParams(params, { replace: true });
//     }, [bloodGroup, district]);

//     const hasFilters = Boolean(bloodGroup || district);

//     return (
//         <div className="md:min-h-screen min-h-[calc(100vh-20rem)] bg-gradient-to-b from-rose-50 via-rose-50/60 to-white">
//             {/* Fixed Filter Bar */}
//             <div className="fixed top-14 left-0 right-0 z-20 border-b border-gray-200/70 bg-[#F2F4F7]/95 backdrop-blur-md">
//                 <div className="mx-auto max-w-[700px] px-3 py-2">
//                     <div className="mb-3 px-0.5 flex items-center justify-between">
//                         <div>
//                             <h1 className="text-xl font-extrabold text-gray-900">Available Donors</h1>
//                             <p className="text-xs text-gray-500">রক্তের গ্রুপ ও জেলা নির্বাচন করুন।</p>
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

//                     {/* {!isLoading && !error && ( */}
//                     <p className="mt-3 text-xs font-medium text-gray-400">
//                         {donors.length} donor{donors.length !== 1 ? "s" : ""} found
//                         {bloodGroup && <> · <span className="text-red-600">{bloodGroup}</span></>}
//                         {district && <> · {district}</>}
//                     </p>
//                     {/* )} */}
//                 </div>
//             </div>

//             {/* Results */}
//             <div className="mx-auto min-h-[calc(100vh-3.5rem)] flex max-w-[700px] px-4 pb-5">
//                 {isLoading ? (
//                     <div className="space-y-3 md:pt-38 pt-52 max-[374px]:pt-64 w-full">
//                         {[1, 2, 3].map((i) => (
//                             <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/70 shadow-sm" />
//                         ))}
//                     </div>
//                 ) : error ? (
//                     <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 md:pt-38 pt-52 max-[374px]:pt-64">
//                         {error}
//                     </p>
//                 ) :
//                     donors.length === 0 ? (
//                         <div className="space-y-3 flex items-center justify-center w-full">
//                             <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 text-center py-16 w-full">
//                                 <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
//                                     <RiSearchLine className="text-2xl text-gray-400" />
//                                 </div>
//                                 <p className="text-sm font-medium text-gray-600">No available donor..</p>
//                                 <p className="mt-1 text-xs text-gray-400">Please try with another blood group and district.</p>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="space-y-3 md:pt-38 pt-52 max-[374px]:pt-64 w-full">
//                             {donors.map((donor) => (
//                                 <DonorCard key={donor._id || donor.email} donor={donor} />
//                             ))}
//                         </div>
//                     )}
//             </div>
//         </div>
//     );
// };

// export default AvailableDonors;


// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { RxPerson } from "react-icons/rx";
// import { RiSearchLine, RiCloseLine } from "react-icons/ri";
// import { HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

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
//         <svg
//             viewBox="0 0 100 120"
//             className="w-full h-full drop-shadow-sm"
//             fill="#dc2626"
//         >
//             <path d="M50 0 C75 25 95 45 95 70 A45 45 0 1 1 5 70 C5 45 25 25 50 0Z" />

//             <text
//                 x="50"
//                 y="68"
//                 textAnchor="middle"
//                 fill="white"
//                 fontSize="24"
//                 fontWeight="bold"
//             >
//                 {group}
//             </text>
//         </svg>
//     </div>
// );

// const DonorCard = ({ donor }) => (
//     <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
//         {donor.photoURL ? (
//             <img
//                 src={donor.photoURL}
//                 alt={donor.name}
//                 referrerPolicy="no-referrer"
//                 className="h-12 w-12 shrink-0 rounded-full border border-gray-100 object-cover"
//             />
//         ) : (
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-400">
//                 <RxPerson className="text-2xl" />
//             </div>
//         )}

//         <div className="min-w-0 flex-1">
//             <p className="truncate font-semibold text-gray-900">
//                 {donor.name || "Unnamed Donor"}
//             </p>

//             <p className="truncate text-sm text-gray-500">
//                 {donor.area}
//                 {donor.area && donor.district ? ", " : ""}
//                 {donor.district}
//             </p>

//             <a
//                 href={`tel:${donor.phone}`}
//                 className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
//             >
//                 <HiOutlinePhone className="text-sm" />
//                 Request
//             </a>
//         </div>

//         <BloodBadge group={donor.bloodGroup} />
//     </div>
// );

// const AvailableDonors = () => {
//     const [searchParams, setSearchParams] = useSearchParams();

//     const [donors, setDonors] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [bloodGroup, setBloodGroup] = useState(
//         searchParams.get("group") || ""
//     );

//     const [district, setDistrict] = useState(
//         searchParams.get("district") || ""
//     );

//     /*
//     ==========================================
//     FETCH DONORS
//     ==========================================
//     */

//     useEffect(() => {
//         const controller = new AbortController();

//         const fetchDonors = async () => {
//             setIsLoading(true);
//             setError("");

//             const params = new URLSearchParams();

//             if (bloodGroup) {
//                 params.set("bloodGroup", bloodGroup);
//             }

//             if (district) {
//                 params.set("district", district);
//             }

//             try {
//                 const res = await fetch(
//                     `${API_URL}/donors?${params.toString()}`,
//                     {
//                         signal: controller.signal,
//                         cache: "no-store",
//                     }
//                 );

//                 if (!res.ok) {
//                     throw new Error(
//                         "ডোনার লোড করতে সমস্যা হয়েছে"
//                     );
//                 }

//                 const data = await res.json();

//                 if (!controller.signal.aborted) {
//                     setDonors(
//                         Array.isArray(data) ? data : []
//                     );
//                 }
//             } catch (err) {
//                 if (err.name === "AbortError") {
//                     return;
//                 }

//                 if (!controller.signal.aborted) {
//                     setError(
//                         err.message ||
//                         "ডোনার লোড করতে সমস্যা হয়েছে"
//                     );
//                 }
//             } finally {
//                 if (!controller.signal.aborted) {
//                     setIsLoading(false);
//                 }
//             }
//         };

//         fetchDonors();

//         return () => {
//             controller.abort();
//         };
//     }, [bloodGroup, district]);

//     /*
//     ==========================================
//     UPDATE URL SEPARATELY
//     ==========================================
//     */

//     useEffect(() => {
//         const params = {};

//         if (bloodGroup) {
//             params.group = bloodGroup;
//         }

//         if (district) {
//             params.district = district;
//         }

//         setSearchParams(params, {
//             replace: true,
//         });
//     }, [bloodGroup, district, setSearchParams]);

//     const hasFilters = Boolean(
//         bloodGroup || district
//     );

//     /*
//     IMPORTANT:
//     Filter change হলে result container-এর key change হবে
//     */

//     const resultsKey = `${bloodGroup || "all"}-${district || "all"}`;

//     return (
//         <div className="md:min-h-screen min-h-[calc(100vh-20rem)] bg-gradient-to-b from-rose-50 via-rose-50/60 to-white">

//             {/* Fixed Filter Bar */}
//             <div className="fixed top-14 left-0 right-0 z-20 border-b border-gray-200/70 bg-[#F2F4F7]/95 backdrop-blur-md">

//                 <div className="mx-auto max-w-[700px] px-3 py-2">

//                     <div className="mb-3 px-0.5 flex items-center justify-between">

//                         <div>
//                             <h1 className="text-xl font-extrabold text-gray-900">
//                                 Available Donors
//                             </h1>

//                             <p className="text-xs text-gray-500">
//                                 রক্তের গ্রুপ ও জেলা নির্বাচন করুন।
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
//                                         onClick={() =>
//                                             setBloodGroup(
//                                                 active ? "" : bg
//                                             )
//                                         }
//                                         className={`w-full rounded-full px-2 py-2 text-sm font-bold transition ${active
//                                                 ? "bg-red-600 text-white shadow-md shadow-red-200"
//                                                 : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-red-50 hover:text-red-600"
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
//                                 onChange={(e) =>
//                                     setDistrict(e.target.value)
//                                 }
//                                 className="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
//                             >
//                                 <option value="">
//                                     Select District
//                                 </option>

//                                 {districts.map((d) => (
//                                     <option
//                                         key={d}
//                                         value={d}
//                                     >
//                                         {d}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Result Count */}
//                     <p className="mt-3 text-xs font-medium text-gray-400">

//                         {donors.length} donor
//                         {donors.length !== 1 ? "s" : ""} found

//                         {bloodGroup && (
//                             <>
//                                 {" · "}
//                                 <span className="text-red-600">
//                                     {bloodGroup}
//                                 </span>
//                             </>
//                         )}

//                         {district && (
//                             <>
//                                 {" · "}
//                                 {district}
//                             </>
//                         )}

//                     </p>

//                 </div>
//             </div>

//             {/* Results */}
//             <div className="mx-auto min-h-[calc(100vh-3.5rem)] flex max-w-[700px] px-4 pb-5">

//                 {isLoading ? (

//                     <div className="space-y-3 md:pt-38 pt-52 max-[374px]:pt-64 w-full">

//                         {[1, 2, 3].map((i) => (
//                             <div
//                                 key={i}
//                                 className="h-24 animate-pulse rounded-2xl bg-white/70 shadow-sm"
//                             />
//                         ))}

//                     </div>

//                 ) : error ? (

//                     <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 md:pt-38 pt-52 max-[374px]:pt-64">
//                         {error}
//                     </p>

//                 ) : donors.length === 0 ? (

//                     <div
//                         key={resultsKey}
//                         className="space-y-3 flex items-center justify-center w-full"
//                     >
//                         <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 text-center py-16 w-full">

//                             <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
//                                 <RiSearchLine className="text-2xl text-gray-400" />
//                             </div>

//                             <p className="text-sm font-medium text-gray-600">
//                                 No available donor..
//                             </p>

//                             <p className="mt-1 text-xs text-gray-400">
//                                 Please try with another blood group and district.
//                             </p>

//                         </div>
//                     </div>

//                 ) : (

//                     <div
//                         key={resultsKey}
//                         className="space-y-3 md:pt-38 pt-52 max-[374px]:pt-64 w-full"
//                     >
//                         {donors.map((donor) => (
//                             <DonorCard
//                                 key={donor._id || donor.email}
//                                 donor={donor}
//                             />
//                         ))}
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// };

// export default AvailableDonors;



import { memo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RxPerson } from "react-icons/rx";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import {
    HiOutlinePhone,
    HiOutlineLocationMarker,
} from "react-icons/hi";
import DonorCard from "../component/DonorCard";

const bloodGroups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
];

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


const AvailableDonors = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [donors, setDonors] = useState([]);
    const [error, setError] = useState("");

    const [bloodGroup, setBloodGroup] = useState(
        searchParams.get("group") || ""
    );

    const [district, setDistrict] = useState(
        searchParams.get("district") || ""
    );


    // Fetch Donors


    useEffect(() => {
        const controller = new AbortController();

        const fetchDonors = async () => {
            const params = new URLSearchParams();

            if (bloodGroup) {
                params.set("bloodGroup", bloodGroup);
            }

            if (district) {
                params.set("district", district);
            }

            try {
                setError("");

                const res = await fetch(
                    `${API_URL}/donors?${params.toString()}`,
                    {
                        signal: controller.signal,
                        cache: "no-store",
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "ডোনার লোড করতে সমস্যা হয়েছে"
                    );
                }

                const data = await res.json();

                if (!controller.signal.aborted) {
                    setDonors(
                        Array.isArray(data) ? data : []
                    );
                }
            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                }

                if (!controller.signal.aborted) {
                    setError(
                        err.message ||
                            "ডোনার লোড করতে সমস্যা হয়েছে"
                    );
                }
            }
        };

        fetchDonors();

        return () => {
            controller.abort();
        };
    }, [bloodGroup, district]);

   
    



    useEffect(() => {
        const params = {};

        if (bloodGroup) {
            params.group = bloodGroup;
        }

        if (district) {
            params.district = district;
        }

        setSearchParams(params, {
            replace: true,
        });
    }, [
        bloodGroup,
        district,
        setSearchParams,
    ]);





    const hasFilters = Boolean(
        bloodGroup || district
    );

    const resultsKey = `${bloodGroup || "all"}-${
        district || "all"
    }`;


    return (
        <div className="min-h-dvh bg-gradient-to-b from-rose-50 via-rose-50/60 to-white">


            <div className="fixed left-0 right-0 top-14 z-10 border-b border-gray-200/70 bg-white/40 backdrop-blur-3xl">
                <div className="mx-auto max-w-[700px] px-3 py-2">

                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between px-0.5">
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">
                                Available Donors
                            </h1>

                            <p className="text-xs text-gray-500">
                                রক্তের গ্রুপ ও জেলা নির্বাচন করুন।
                            </p>
                        </div>

                        {hasFilters && (
                            <button
                                onClick={() => {
                                    setBloodGroup("");
                                    setDistrict("");
                                }}
                                className="flex shrink-0 items-center gap-1 rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600"
                            >
                                <RiCloseLine className="text-sm" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:gap-2 lg:gap-1">

                        {/* Blood Groups */}
                        <div className="grid w-full grid-cols-4 gap-2 px-0 min-[374px]:grid-cols-8">
                            {bloodGroups.map((bg) => {
                                const active =
                                    bloodGroup === bg;

                                return (
                                    <button
                                        key={bg}
                                        onClick={() =>
                                            setBloodGroup(
                                                active ? "" : bg
                                            )
                                        }
                                        className={`w-full rounded-full px-2 py-2 text-sm font-bold ${
                                            active
                                                ? "bg-red-600 text-white shadow-md shadow-red-200"
                                                : "bg-white text-gray-600 ring-1 ring-gray-200"
                                        }`}
                                    >
                                        {bg}
                                    </button>
                                );
                            })}
                        </div>

                        {/* District */}
                        <div className="relative w-full min-w-[180px] md:w-auto">
                            <HiOutlineLocationMarker className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

                            <select
                                value={district}
                                onChange={(e) =>
                                    setDistrict(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            >
                                <option value="">
                                    Select District
                                </option>

                                {districts.map((d) => (
                                    <option
                                        key={d}
                                        value={d}
                                    >
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Result Count */}

                    {!error && (
                        <p className="mt-3 text-xs font-medium text-gray-400">
                            {donors.length} donor
                            {donors.length !== 1
                                ? "s"
                                : ""}{" "}
                            found

                            {bloodGroup && (
                                <>
                                    {" · "}
                                    <span className="text-red-600">
                                        {bloodGroup}
                                    </span>
                                </>
                            )}

                            {district && (
                                <>
                                    {" · "}
                                    {district}
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>

            <div className="mx-auto flex min-h-dvh max-w-[700px] px-4 pb-5">
                <div className="w-full md:pt-40 pt-52 max-[374px]:pt-64">

                    {error ? (
                        /* Error */
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </p>
                    ) : donors.length === 0 ? (
                        /* Empty */
                        <div
                            key={resultsKey}
                            className="w-full space-y-3"
                        >
                            <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 py-16 text-center">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                    <RiSearchLine className="text-2xl text-gray-400" />
                                </div>

                                <p className="text-sm font-medium text-gray-600">
                                    No available donor..
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Please try with another blood group and district.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Donor Results */
                        <div
                            key={resultsKey}
                            className="w-full space-y-3 "
                        >
                            {donors.map((donor) => (
                                <DonorCard
                                    key={
                                        donor._id ||
                                        donor.email
                                    }
                                    donor={donor}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvailableDonors;
