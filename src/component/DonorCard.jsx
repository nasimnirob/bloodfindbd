import { HiOutlinePhone } from "react-icons/hi";
import BloodBadge from "./BloodBadge";
import { memo } from "react";
import { RxPerson } from "react-icons/rx";

const DonorCard = memo(({ donor }) => {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
            {donor.photoURL ? (
                <img
                    src={donor.photoURL}
                    alt={donor.name}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 shrink-0 rounded-full border border-gray-100 object-cover"
                />
            ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <RxPerson className="text-2xl" />
                </div>
            )}

            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">
                    {donor.name || "Unnamed Donor"}
                </p>

                <p className="truncate text-sm text-gray-500">
                    {donor.area}
                    {donor.area && donor.district ? ", " : ""}
                    {donor.district}
                </p>

                <a
                    href={`tel:${donor.phone}`}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white"
                >
                    <HiOutlinePhone className="text-sm" />
                    Request
                </a>
            </div>

            <BloodBadge group={donor.bloodGroup} />
        </div>
    );
});

// DonorCard.displayName = "DonorCard";
export default DonorCard;