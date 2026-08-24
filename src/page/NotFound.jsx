import React from "react";
import { Droplet, ArrowLeft, Home, HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[95vh] bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl text-center">
        {/* Blood Drop */}
        <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full "></div>

          <div className="">
            <HeartPulse className=" text-red-500 h-28 w-28 p-1.5 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tight text-red-600">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-3 text-2xl sm:text-4xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-7 text-gray-500">
          The page you are looking for may have been moved, deleted, or
          temporarily unavailable. Don't worry, your search for a better
          tomorrow continues with Blood Find.
        </p>

        {/* Blood Find message */}
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full border border-red-100 bg-white px-5 py-3 shadow-sm">
          <Droplet
            size={18}
            fill="#dc2626"
            color="#dc2626"
          />

          <span className="text-sm font-medium text-gray-600">
            Every drop can save a life
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-gray-900 hover:-translate-y-0.5"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-md shadow-red-200 transition duration-200 hover:bg-red-700 hover:-translate-y-0.5"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>

        {/* Brand */}
        <p className="mt-10 text-sm text-gray-400">
          Blood Find • Connecting donors with those in need
        </p>
      </div>
    </div>
  );
};

export default NotFound;
