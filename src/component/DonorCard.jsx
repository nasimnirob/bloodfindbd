import { memo } from "react";
import { HiOutlinePhone } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";

import BloodBadge from "./BloodBadge";

const DonorCard = memo(({ donor }) => {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">

            {/* Profile */}

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

            {/* Information */}

            <div className="min-w-0 flex-1">

                <p className="truncate font-semibold text-gray-900">
                    {donor.name ||
                        "Unnamed Donor"}
                </p>

                <p className="truncate text-sm text-gray-500">
                    {donor.area}

                    {donor.area &&
                        donor.district &&
                        ", "}

                    {donor.district}
                </p>

                {/* Distance */}

                {typeof donor.distance ===
                    "number" && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                        📍{" "}
                        {donor.distance <
                        1
                            ? `${Math.round(
                                  donor.distance *
                                      1000
                              )} m away`
                            : `${donor.distance} km away`}
                    </p>
                )}

                {/* Request */}

                <a
                    href={`tel:${donor.phone}`}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white"
                >
                    <HiOutlinePhone className="text-sm" />

                    Request
                </a>

            </div>

            {/* Blood */}

            <BloodBadge
                group={
                    donor.bloodGroup
                }
            />

        </div>
    );
});

export default DonorCard;