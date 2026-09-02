import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    RiSearchLine,
    RiCloseLine,
    RiMapPinUserLine,
} from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";

import DonorCard from "../component/DonorCard";
import DonorCardSkeleton from "../component/DonorCardSkeleton";

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

const API_URL = import.meta.env.VITE_API_URL;

const radiusOptions = [
    5,
    10,
    25,
    50,
];

const AvailableDonors = () => {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const [donors, setDonors] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [bloodGroup, setBloodGroup] = useState(
        searchParams.get("group") || ""
    );

    const [district, setDistrict] = useState(
        searchParams.get("district") || ""
    );

    const [nearMe, setNearMe] = useState(false);

    const [radius, setRadius] = useState(10);

    const [userLocation, setUserLocation] =
        useState(null);

    const [locationLoading, setLocationLoading] =
        useState(false);

    // --------------------------------
    // Get User Location
    // --------------------------------

    const handleNearMe = () => {
        if (nearMe) {
            setNearMe(false);
            setUserLocation(null);
            return;
        }

        if (!navigator.geolocation) {
            setError(
                "আপনার browser location support করে না।"
            );
            return;
        }

        setLocationLoading(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;

                setUserLocation({
                    lat,
                    lng,
                });

                setNearMe(true);
                setLocationLoading(false);
            },
            (error) => {
                console.error(error);

                setLocationLoading(false);

                setError(
                    "Location permission দিন, তারপর আবার Near Me চাপুন।"
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    // --------------------------------
    // Fetch Donors
    // --------------------------------

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchDonors = async () => {
            setLoading(true);
            setError("");

            const params =
                new URLSearchParams();

            if (bloodGroup) {
                params.set(
                    "bloodGroup",
                    bloodGroup
                );
            }

            if (district) {
                params.set(
                    "district",
                    district
                );
            }

            // Near Me
            if (
                nearMe &&
                userLocation
            ) {
                params.set(
                    "lat",
                    userLocation.lat
                );

                params.set(
                    "lng",
                    userLocation.lng
                );

                params.set(
                    "radius",
                    radius
                );
            }

            try {
                const res = await fetch(
                    `${API_URL}/donors?${params.toString()}`,
                    {
                        signal:
                            controller.signal,
                        cache: "no-store",
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        "ডোনার লোড করতে সমস্যা হয়েছে"
                    );
                }

                const data =
                    await res.json();

                if (
                    !controller.signal.aborted
                ) {
                    setDonors(
                        Array.isArray(data)
                            ? data
                            : []
                    );
                }
            } catch (err) {
                if (
                    err.name ===
                    "AbortError"
                ) {
                    return;
                }

                if (
                    !controller.signal.aborted
                ) {
                    setError(
                        err.message ||
                            "ডোনার লোড করতে সমস্যা হয়েছে"
                    );

                    setDonors([]);
                }
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        };

        fetchDonors();

        return () => {
            controller.abort();
        };
    }, [
        bloodGroup,
        district,
        nearMe,
        userLocation,
        radius,
    ]);

    // --------------------------------
    // Sync URL
    // --------------------------------

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

    // --------------------------------
    // Clear
    // --------------------------------

    const clearFilters = () => {
        setBloodGroup("");
        setDistrict("");
        setNearMe(false);
        setUserLocation(null);
        setRadius(10);
    };

    const hasFilters =
        Boolean(
            bloodGroup ||
                district ||
                nearMe
        );

    return (
        <div className="min-h-dvh bg-gradient-to-b from-rose-50 via-rose-50/60 to-white">

            {/* Header */}

            <div className="fixed left-0 right-0 top-14 z-10 border-b border-gray-200/70 bg-white/40 backdrop-blur-3xl">

                <div className="mx-auto max-w-[700px] px-3 py-2">

                    {/* Header */}

                    <div className="mb-3 flex items-center justify-between px-0.5">

                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">
                                Available Donors
                            </h1>

                            <p className="text-xs text-gray-500">
                                রক্তের গ্রুপ, জেলা অথবা কাছাকাছি ডোনার খুঁজুন।
                            </p>
                        </div>

                        {hasFilters && (
                            <button
                                onClick={
                                    clearFilters
                                }
                                className="flex shrink-0 items-center gap-1 rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600"
                            >
                                <RiCloseLine className="text-sm" />

                                Clear
                            </button>
                        )}

                    </div>

                    {/* Blood Groups */}

                    <div className="grid w-full grid-cols-4 gap-2 min-[374px]:grid-cols-8">

                        {bloodGroups.map(
                            (bg) => {
                                const active =
                                    bloodGroup ===
                                    bg;

                                return (
                                    <button
                                        key={bg}
                                        onClick={() =>
                                            setBloodGroup(
                                                active
                                                    ? ""
                                                    : bg
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
                            }
                        )}

                    </div>

                    {/* District + Near Me */}

                    <div className="mt-3 flex w-full flex-row gap-2 sm:flex-row">

                        {/* District */}

                        <div className="relative flex-1">

                            <HiOutlineLocationMarker className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

                            <select
                                value={
                                    district
                                }
                                onChange={(
                                    e
                                ) =>
                                    setDistrict(
                                        e.target
                                            .value
                                    )
                                }
                                className="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            >
                                <option value="">
                                    Select District
                                </option>

                                {districts.map(
                                    (d) => (
                                        <option
                                            key={
                                                d
                                            }
                                            value={
                                                d
                                            }
                                        >
                                            {d}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                        {/* Near Me */}

                        <button
                            onClick={
                                handleNearMe
                            }
                            disabled={
                                locationLoading
                            }
                            className={`flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                                nearMe
                                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                                    : "bg-white text-gray-700 ring-1 ring-gray-200"
                            }`}
                        >

                            <RiMapPinUserLine />

                            {locationLoading
                                ? "Locating..."
                                : nearMe
                                ? "Near Me ✓"
                                : "Near Me"}

                        </button>

                    </div>

                    {/* Radius */}

                    {nearMe && (
                        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">

                            <span className="shrink-0 text-xs font-medium text-gray-500">
                                Within:
                            </span>

                            {radiusOptions.map(
                                (item) => (
                                    <button
                                        key={
                                            item
                                        }
                                        onClick={() =>
                                            setRadius(
                                                item
                                            )
                                        }
                                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                            radius ===
                                            item
                                                ? "bg-red-100 text-red-600 ring-1 ring-red-200"
                                                : "bg-white text-gray-500 ring-1 ring-gray-200"
                                        }`}
                                    >
                                        {item} km
                                    </button>
                                )
                            )}

                        </div>
                    )}

                    {/* Result Count */}

                    {!error &&
                        !loading && (
                            <p className="mt-3 text-xs font-medium text-gray-400">

                                {donors.length} donor
                                {donors.length !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                found

                                {bloodGroup && (
                                    <>
                                        {" · "}

                                        <span className="text-red-600">
                                            {
                                                bloodGroup
                                            }
                                        </span>
                                    </>
                                )}

                                {district && (
                                    <>
                                        {" · "}
                                        {
                                            district
                                        }
                                    </>
                                )}

                                {nearMe && (
                                    <>
                                        {" · "}
                                        Within{" "}
                                        {
                                            radius
                                        }{" "}
                                        km
                                    </>
                                )}

                            </p>
                        )}

                </div>

            </div>

            {/* Content */}

            <div className="mx-auto flex min-h-dvh max-w-[700px] px-4 pb-5">

                <div className={`w-full  max-[374px]:pt-96 ${
                                nearMe
                                    ? " pt-62 md:pt-60"
                                    : "pt-50 md:pt-50"
                            }`}>

                    {/* Error */}

                    {error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    ) : loading ? (
                        <div className="w-full space-y-3">

                            {Array.from(
                                {
                                    length: 8,
                                }
                            ).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <DonorCardSkeleton
                                        key={
                                            index
                                        }
                                    />
                                )
                            )}

                        </div>
                    ) : donors.length ===
                      0 ? (
                        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 py-16 text-center">

                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

                                <RiSearchLine className="text-2xl text-gray-400" />

                            </div>

                            <p className="text-sm font-medium text-gray-600">
                                {nearMe
                                    ? `No donor found within ${radius} km`
                                    : "No available donor"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Try another blood group, district or search radius.
                            </p>

                        </div>
                    ) : (
                        <div className="w-full space-y-3">

                            {donors.map(
                                (
                                    donor
                                ) => (
                                    <DonorCard
                                        key={
                                            donor._id ||
                                            donor.email
                                        }
                                        donor={
                                            donor
                                        }
                                    />
                                )
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default AvailableDonors;