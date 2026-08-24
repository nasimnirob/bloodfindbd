import { Hospital } from "lucide-react";
import BloodBadge from "./BloodBadge";
import { HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";
import { RiMapPinLine, RiTimeLine } from "react-icons/ri";

const timeAgo = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "এইমাত্র";
    if (mins < 60) return `${mins} মিনিট আগে`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    const days = Math.floor(hours / 24);
    return `${days} দিন আগে`;
};


const RequestCard = ({ request, distance }) => (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1 ">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <p className="truncate text-lg font-semibold text-gray-900">{request.patientName}</p>
                        <p className="truncate text-base font-semibold text-gray-900">{request.patientProblem}</p>
                    </div>
                    {request.urgency === "urgent" && (
                        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                            URGENT
                        </span>
                    )}
                    {distance != null && (
                        <span className="shrink-0 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-600">
                            {distance < 1 ? "< 1 km" : `${distance.toFixed(1)} km`}
                        </span>
                    )}
                </div>

                {request.hospital && (
                    <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
                        <Hospital className="shrink-0 text-base" />
                        {request.hospital}
                    </p>
                )}

                <div className="py-1">
                    <p className="mt-1 flex items-start  gap-1.5  text-sm text-gray-500">
                        <HiOutlineLocationMarker className="shrink-0 text-base mt-0.5" />
                        {request.area}{request.area && request.district ? ", " : ""}{request.district}
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                        <RiTimeLine className="shrink-0 text-base" />
                        {timeAgo(request.createdAt)} · {request.unitsNeeded} unit{request.unitsNeeded !== 1 ? "s" : ""} প্রয়োজন
                    </p>

                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <a
                        href={`tel:${request.contactPhone}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                    >
                        <HiOutlinePhone className="text-sm" />
                        Call & Help
                    </a>

                    {/* Opens the hospital's exact pinned location directly in Google Maps — no API key needed, just a deep link */}
                    {request.location?.lat && request.location?.lng && (
                        <a
                            href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#CCF5E1] bg-[#ECFDF5] px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            <RiMapPinLine className="text-sm" />
                            Live Location
                        </a>
                    )}
                </div>
            </div>

            <div className="">
                <BloodBadge group={request.bloodGroup} />
            </div>
        </div>
    </div>
);


export default RequestCard;