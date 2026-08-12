// import React from 'react'

// function Donate() {
//   return (
//     <div className='flex items-center justify-center w-full min-h-[calc(100vh-3rem)]'>Donate</div>
//   )
// }

// export default Donate



import { useState } from "react";

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
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
  "Narayanganj",
  "Cox's Bazar",
];

export default function Donate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    district: "",
    area: "",
    lastDonationDate: "",
    available: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Backend API later:
      // const response = await fetch("http://localhost:5000/donors", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      console.log("Donor Data:", formData);

      // Temporary delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Thank you! Your donor registration has been submitted.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        bloodGroup: "",
        district: "",
        area: "",
        lastDonationDate: "",
        available: true,
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl">🩸</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Become a Blood Donor
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            আপনার একটি দান একটি জীবন বাঁচাতে পারে। দাতা হিসেবে নিবন্ধন করুন এবং জরুরি অবস্থায় কোনো অভাবী মানুষকে সাহায্য করুন।
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.4fr]">

          {/* Left Information */}
          <div className="space-y-5">

            {/* Why Donate */}
            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Why become a donor?
              </h2>

              <div className="mt-5 space-y-5">

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                    ❤️
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      Save Lives
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Your blood donation can help patients during critical
                      situations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                    🔍
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      Help Someone Nearby
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Your location helps people find suitable donors nearby.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                    🤝
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      Build a Community
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Become part of a community that supports people in
                      emergencies.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Eligibility */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Before you register
              </h2>

              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  You should be in good general health.
                </li>

                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Your donor information should be accurate.
                </li>

                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Keep your phone number active.
                </li>

                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Update your availability when necessary.
                </li>
              </ul>
            </div>

          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">

            <div className="mb-7">
              <h2 className="text-2xl font-semibold text-gray-900">
                Donor Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Please provide accurate information.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name & Email */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

              </div>

              {/* Phone & Blood Group */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Blood Group <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select blood group</option>

                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* District & Area */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    District <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">Select district</option>

                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Area
                  </label>

                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Mirpur, Dhanmondi"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

              </div>

              {/* Last Donation */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last Donation Date
                </label>

                <input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />

                <p className="mt-2 text-xs text-gray-400">
                  If you have never donated blood, you can leave this empty.
                </p>
              </div>

              {/* Availability */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 accent-red-600"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      I am currently available for blood donation.
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      You can change your availability later.
                    </p>
                  </div>

                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Registering...
                  </>
                ) : (
                  <>
                    🩸 Register as Donor
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-gray-400">
                By registering, you agree to provide accurate information and
                be contacted when your blood group is needed.
              </p>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}