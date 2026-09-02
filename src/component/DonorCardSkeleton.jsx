const DonorCardSkeleton = () => {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
            {/* Avatar */}
            <div className="skeleton h-12 w-12 shrink-0 rounded-full" />

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-2">
                {/* Name */}
                <div className="skeleton h-4 w-32 rounded-md" />

                {/* Location */}
                <div className="skeleton h-3 w-40 rounded-md" />

                {/* Button */}
                <div className="skeleton mt-2 h-7 w-20 rounded-full" />
            </div>

            {/* Blood badge */}
            <div className="skeleton h-8 w-12 shrink-0 rounded-full" />
        </div>
    );
};

export default DonorCardSkeleton;



// import React from 'react'

// export default function DonorCardSkeleton() {
//     return (
//         <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
//             {/* Avatar */}
//             <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />

//             {/* Content */}
//             <div className="min-w-0 flex-1 space-y-2">
//                 {/* Name */}
//                 <div className="h-4 w-32 rounded bg-gray-200" />

//                 {/* Location */}
//                 <div className="h-3 w-40 rounded bg-gray-100" />

//                 {/* Request button */}
//                 <div className="mt-2 h-7 w-20 rounded-full bg-gray-200" />
//             </div>

//             {/* Blood badge */}
//             <div className="h-8 w-12 shrink-0 rounded-full bg-gray-200" />
//         </div>

//     )
// }
