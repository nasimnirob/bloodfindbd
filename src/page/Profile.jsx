import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HiOutlinePencil,
  HiOutlineLogout,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineX,
} from "react-icons/hi";

import { RiDropFill } from "react-icons/ri";
import { FaMedal } from "react-icons/fa";
import { MdOutlineManageAccounts } from "react-icons/md";

import { AuthContext } from "../providers/AuthProviders";
import toast from "react-hot-toast";
import { SquarePen } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
  const { user, loading, logOut, updateUserProfile } =
    useContext(AuthContext);

  const navigate = useNavigate();



  // STATES

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [postCount, setPostCount] = useState(0);
  const [postLoading, setPostLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [available, setAvailable] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    district: "",
    area: "",
    gender: "",
  });


  // FETCH REAL USER PROFILE

  useEffect(() => {
    if (loading) return;

    if (!user?.email) {
      setProfileLoading(false);
      return;
    }

    // Profile

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(
            user.email
          )}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("PROFILE_NOT_FOUND");
          }

          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();

        setProfile(data);

        setAvailable(data.available ?? true);

        setForm({
          name: data.name || user.displayName || "",
          phone: data.phone || "",
          bloodGroup: data.bloodGroup || "",
          district: data.district || "",
          area: data.area || "",
          gender: data.gender || "",
        });
      } catch (error) {
        console.error("Profile fetch error:", error);

        if (error.message === "PROFILE_NOT_FOUND") {
          toast.error("Profile not found");
        } else {
          toast.error("There was a problem loading the profile");
        }
      } finally {
        setProfileLoading(false);
      }
    };


    fetchProfile();
  }, [user?.email, user?.displayName, loading]);


  useEffect(() => {
    if (loading || !user?.email) return;

    const fetchPostCount = async () => {
      try {
        setPostLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(
            user.email
          )}/post-count`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch post count");
        }

        const data = await res.json();

        setPostCount(Number(data.count) || 0);
      } catch (error) {
        console.error("Post count error:", error);
        setPostCount(0);
      } finally {
        setPostLoading(false);
      }
    };

    fetchPostCount();
  }, [user?.email, loading]);


  // FORM CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // LOGOUT

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("LogOut Error Please Try again..");
    }
  };


  // SAVE PROFILE

  const handleSave = async () => {
    if (!user?.email) {
      toast.error("User email not found");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!form.bloodGroup) {
      toast.error("Please Select Blood group");
      return;
    }

    try {
      setSaving(true);


      // Firebase displayName update

      if (form.name !== user.displayName) {
        await updateUserProfile({
          displayName: form.name,
        });
      }

      // MongoDB profile update

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(
          user.email
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            bloodGroup: form.bloodGroup,
            district: form.district,
            area: form.area,
            gender: form.gender,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }


      // Get latest MongoDB data

      const profileRes = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(
          user.email
        )}`
      );

      if (!profileRes.ok) {
        throw new Error("Failed to reload profile");
      }

      const updatedProfile = await profileRes.json();

      setProfile(updatedProfile);

      setAvailable(updatedProfile.available ?? true);

      setForm({
        name: updatedProfile.name || "",
        phone: updatedProfile.phone || "",
        bloodGroup: updatedProfile.bloodGroup || "",
        district: updatedProfile.district || "",
        area: updatedProfile.area || "",
        gender: updatedProfile.gender || "",
      });

      setEditing(false);

      toast.success("Profile undated successful");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };


  // TOGGLE AVAILABILITY

  const handleToggleAvailable = async () => {
    if (!user?.email) {
      toast.error("User email not found");
      return;
    }

    const next = !available;

    try {
      setAvailable(next);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(
          user.email
        )}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: next,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Availability update failed");
      }

      setProfile((prev) => ({
        ...prev,
        available: next,
      }));

      toast.success(
        next
          ? "You are now available as a donor"
          : "You are set as temporarily unavailable"
      );
    } catch (error) {
      console.error("Availability error:", error);

      // rollback
      setAvailable(!next);

      toast.error("Availability update করতে সমস্যা হয়েছে");
    }
  };


  // LOADING


  // if (loading || profileLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4">
  //       <div className="flex min-h-screen items-center justify-center">
  //         <div className="text-center">
  //           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />

  //           <p className="mt-4 text-sm font-medium text-gray-500">
  //             Profile loading...
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }


  // NO FIREBASE USER

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
          <div className="w-full rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <MdOutlineManageAccounts className="mx-auto mb-4 rounded-full bg-red-600 text-[80px] text-white" />

            <h2 className="text-xl font-bold text-gray-900">
              Login Required
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              User not found
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }


  // PROFILE NOT FOUND

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 pt-10">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <MdOutlineManageAccounts className="mx-auto mb-4 rounded-full bg-red-600 text-[80px] text-white" />

            <h2 className="text-xl font-bold text-gray-900">
              Profile Not Found
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Server Error, Please Reload..
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }


  const totalDonations = Number(profile.totalDonations) || 0;

  const lastDonationDate = profile.lastDonation
    ? new Date(profile.lastDonation)
    : null;

  const validLastDonation =
    lastDonationDate && !Number.isNaN(lastDonationDate.getTime());

  const daysSince = validLastDonation
    ? Math.max(
      0,
      Math.floor(
        (Date.now() - lastDonationDate.getTime()) /
        (1000 * 60 * 60 * 24)
      )
    )
    : null;

  const daysRemaining =
    daysSince === null ? 0 : Math.max(90 - daysSince, 0);

  const isEligible =
    daysSince === null || daysRemaining === 0;

  const formattedLastDonation = validLastDonation
    ? lastDonationDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "No donation record";


  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 pb-20 pt-10">
      <div className="mx-auto max-w-2xl space-y-4">


        {/* PROFILE CARD  */}

        <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-[0_8px_30px_rgba(220,38,38,0.08)]">

          {/* Profile image */}

          <div className="relative mx-auto w-fit">

            {profile.photoURL || user.photoURL ? (
              <img
                src={profile.photoURL || user.photoURL}
                alt={profile.name || "Profile"}
                referrerPolicy="no-referrer"
                className="h-24 w-24 rounded-full border-4 border-red-100 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-red-100 bg-red-600 text-4xl font-bold text-white">
                {(profile.name ||
                  user.displayName ||
                  user.email ||
                  "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            {/* Blood group badge */}

            {profile.bloodGroup && (
              <span className="absolute bottom-0 right-0 flex h-8 min-w-8 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-bold text-white shadow-lg">
                {profile.bloodGroup}
              </span>
            )}
          </div>

          {/* Name */}

          <h1 className="mt-4 flex items-center justify-center gap-2 text-xl font-extrabold text-gray-900">
            {profile.name || user.displayName || "No Name"}
          </h1>

          {/* Location */}

          <p className="mt-1 text-sm text-gray-500">
            {profile.area && profile.district
              ? `${profile.area}, ${profile.district}`
              : profile.district || "Blood Donor"}
          </p>

          {/* Email verification */}

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">

            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                <HiOutlineShieldCheck className="text-sm" />
                Verified
              </span>
            ) : (
              <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                Email is not verified
              </span>
            )}

          </div>

          {/* Availability */}

          <button

            disabled={!profile}
            className={`mt-5 flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${available
              ? "border-emerald-200 bg-emerald-50"
              : "border-gray-200 bg-gray-50"
              }`}
          >
            <span
              className={`text-sm font-semibold ${available
                ? "text-emerald-700"
                : "text-gray-500"
                }`}
            >
              {available
                ? "Available to Donate"
                : "Currently Unavailable"}
            </span>

            <span
              onClick={handleToggleAvailable}
              className={`relative h-6 w-11 rounded-full transition cursor-pointer ${available
                ? "bg-emerald-500"
                : "bg-gray-300"
                }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform  ${available
                  ? "translate-x-5"
                  : "translate-x-0"
                  }`}
              />
            </span>
          </button>

        </div>


        {/* STATS */}


        <div className="grid grid-cols-4 gap-3">


          {/* Post Count */}

          <div
            onClick={() => navigate("/my-posts")}
            className="rounded-2xl border border-red-100 bg-white p-4 text-center shadow-sm cursor-pointer">
            <SquarePen className="mx-auto mb-1 text-xl text-red-500" />

            <p className="text-lg font-extrabold text-gray-900">
              {postLoading ? "..." : postCount}
            </p>

            <p className="text-xs text-gray-400">
              Total Posts
            </p>
          </div>

          {/* Donation */}

          <div className="rounded-2xl border border-red-100 bg-white p-4 text-center shadow-sm">
            <RiDropFill className="mx-auto mb-1 text-xl text-red-500" />

            <p className="text-lg font-extrabold text-gray-900">
              {totalDonations}
            </p>

            <p className="text-xs text-gray-400">
              Total Donations
            </p>
          </div>

          {/* Lives impacted */}

          <div className="rounded-2xl border border-red-100 bg-white p-4 text-center shadow-sm">
            <FaMedal className="mx-auto mb-1 text-xl text-amber-500" />

            <p className="text-lg font-extrabold text-gray-900">
              {totalDonations * 3}
            </p>

            <p className="text-xs text-gray-400">
              Lives Impacted
            </p>
          </div>

          {/* Days since */}

          <div className="rounded-2xl border border-red-100 bg-white p-4 text-center shadow-sm">
            <HiOutlineCalendar className="mx-auto mb-1 text-xl text-sky-500" />

            <p className="text-lg font-extrabold text-gray-900">
              {daysSince === null ? "—" : daysSince}
            </p>

            <p className="text-xs text-gray-400">
              Days Since Last
            </p>
          </div>
        </div>


        {/* ELIGIBILITY */}


        <div
          className={`rounded-2xl border p-5 shadow-sm ${isEligible
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
            }`}
        >
          <div className="flex items-center gap-3">

            <HiOutlineCheckCircle
              className={`text-2xl ${isEligible
                ? "text-emerald-600"
                : "text-amber-600"
                }`}
            />

            <div>

              <p
                className={`font-bold ${isEligible
                  ? "text-emerald-700"
                  : "text-amber-700"
                  }`}
              >
                {isEligible
                  ? "You're eligible to donate now"
                  : "Not eligible yet"}
              </p>

              <p className="text-sm text-gray-600">
                {daysSince === null
                  ? "No previous donation record.."
                  : isEligible
                    ? `Last donation: ${formattedLastDonation}`
                    : `${daysRemaining} more day(s) until your next eligible donation.`}
              </p>

            </div>
          </div>
        </div>


        {/* PERSONAL INFORMATION */}


        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="font-bold text-gray-900">
              Personal Information
            </h2>

            {editing ? (
              <button
                onClick={() => setEditing(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiOutlineX className="text-lg" />
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                <span className="inline-flex items-center gap-1">
                  <HiOutlinePencil />
                  Edit
                </span>
              </button>
            )}

          </div>

          {editing ? (

            /* =========================
               EDIT MODE
            ========================= */

            <div className="space-y-4">

              {/* Name */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Phone + Blood */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Blood Group
                  </label>

                  <select
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  >
                    <option value="">
                      Select
                    </option>

                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* District + Area */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    District
                  </label>

                  <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Dhaka"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Area
                  </label>

                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="Dhanmondi"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>

              </div>

              {/* Gender */}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* Save */}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          ) : (

            /* =========================
               VIEW MODE
            ========================= */

            <div className="divide-y divide-gray-100">

              {/* Email */}

              <div className="flex items-center gap-3 py-3">

                <HiOutlineMail className="text-lg text-gray-400" />

                <div className="min-w-0 text-left">
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="truncate text-sm font-medium text-gray-800">
                    {profile.email || user.email}
                  </p>
                </div>

              </div>

              {/* Phone */}

              <div className="flex items-center gap-3 py-3">

                <HiOutlinePhone className="text-lg text-gray-400" />

                <div className="text-left">
                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-gray-800">
                    {profile.phone || "Not added"}
                  </p>
                </div>

              </div>

              {/* Blood Group */}

              <div className="flex items-center gap-3 py-3">

                <RiDropFill className="text-lg text-red-500" />

                <div className="text-left">
                  <p className="text-xs text-gray-400">
                    Blood Group
                  </p>

                  <p className="text-sm font-bold text-red-600">
                    {profile.bloodGroup || "Not added"}
                  </p>
                </div>

              </div>

              {/* Location */}

              <div className="flex items-center gap-3 py-3">

                <HiOutlineLocationMarker className="text-lg text-gray-400" />

                <div className="text-left">
                  <p className="text-xs text-gray-400">
                    Location
                  </p>

                  <p className="text-sm font-medium text-gray-800">
                    {profile.area && profile.district
                      ? `${profile.area}, ${profile.district}`
                      : profile.district ||
                      profile.area ||
                      "Not added"}
                  </p>
                </div>

              </div>

              {/* Gender */}

              <div className="flex items-center gap-3 py-3">

                <HiOutlineShieldCheck className="text-lg text-gray-400" />

                <div className="text-left">
                  <p className="text-xs text-gray-400">
                    Gender
                  </p>

                  <p className="text-sm font-medium text-gray-800">
                    {profile.gender || "Not added"}
                  </p>
                </div>

              </div>

              {/* Last donation */}

              <div className="flex items-center gap-3 py-3">

                <HiOutlineCalendar className="text-lg text-gray-400" />

                <div className="text-left">
                  <p className="text-xs text-gray-400">
                    Last Donation
                  </p>

                  <p className="text-sm font-medium text-gray-800">
                    {formattedLastDonation}
                  </p>
                </div>

              </div>

            </div>
          )}
        </div>


        {/* DONATION HISTORY */}


        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-bold text-gray-900">
            Donation History
          </h2>

          {/* তোমার backend-এ এখনো history collection/endpoint নেই */}

          <div className="rounded-xl bg-rose-50/60 px-4 py-5 text-center">

            <RiDropFill className="mx-auto mb-2 text-3xl text-red-400" />

            <p className="text-sm font-medium text-gray-600">
              এখনো কোনো ডোনেশন রেকর্ড নেই।
            </p>

            {totalDonations > 0 && (
              <p className="mt-1 text-xs text-gray-400">
                Total donations: {totalDonations}
              </p>
            )}

          </div>

        </div>


        {/* LOGOUT */}


        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
        >
          <HiOutlineLogout className="text-lg" />
          Logout
        </button>

      </div>
    </div>
  );
};

export default Profile;