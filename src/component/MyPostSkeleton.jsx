const MyPostSkeleton = () => {
  return (
    <div className=" rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      {/* Top */}

      <div className=" flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="skeleton h-7 w-14 rounded-full bg-gray-200" />

            <div className="skeleton h-6 w-16 rounded-full bg-gray-200" />
          </div>

          <div className="skeleton mt-4 h-6 w-32 rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Details */}

      <div className="mt-5 space-y-3">
        <div className="skeleton h-4 w-full rounded bg-gray-200" />

        <div className="skeleton h-4 w-11/12 rounded bg-gray-200" />

        <div className="skeleton h-4 w-8/12 rounded bg-gray-200" />

        <div className="skeleton h-4 w-5/12 rounded bg-gray-200" />
      </div>

      {/* Buttons */}

      <div className="mt-5 flex gap-3">
        <div className="skeleton h-10 flex-1 rounded-xl bg-gray-200" />

        <div className="skeleton h-10 flex-1 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
};

export default MyPostSkeleton;