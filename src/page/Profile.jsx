import { useContext, useState } from "react";
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
import { AuthContext } from "../providers/AuthProviders";
import toast from "react-hot-toast";
import { MdOutlineManageAccounts } from "react-icons/md";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// TODO: replace all of this with real data fetched from your backend (by user.email or user.uid)
const MOCK_PROFILE = {
  phone: "01712345678",
  bloodGroup: "O+",
  district: "Dhaka",
  area: "Dhanmondi",
  gender: "Male",
  lastDonation: "2026-04-12",
  totalDonations: 6,
  available: true,
};

const MOCK_HISTORY = [
  { date: "2026-04-12", location: "Dhaka Medical College", recipient: "Emergency request" },
  { date: "2025-12-02", location: "Square Hospital, Dhaka", recipient: "Scheduled donation" },
  { date: "2025-07-19", location: "Chattogram Blood Bank", recipient: "Emergency request" },
];

const NEXT_ELIGIBLE_DAYS = 90; // standard whole-blood donation gap

const Profile = () => {
  const { user, loading, logOut, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState(MOCK_PROFILE.available);

  const [form, setForm] = useState({
    name: user?.displayName || "",
    phone: MOCK_PROFILE.phone,
    bloodGroup: MOCK_PROFILE.bloodGroup,
    district: MOCK_PROFILE.district,
    area: MOCK_PROFILE.area,
    gender: MOCK_PROFILE.gender,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (err) {
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }

    try {
      setSaving(true);

      if (form.name !== user?.displayName) {
        await updateUserProfile({ displayName: form.name });
      }

      // TODO: save phone / bloodGroup / district / area / gender to your database
      await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      toast.success("প্রোফাইল আপডেট হয়েছে");
      setEditing(false);
    } catch (err) {
      toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailable = async () => {
    const next = !available;
    setAvailable(next);

    // TODO: persist to backend
    // await fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}/availability`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ available: next }),
    // });

    toast.success(next ? "তুমি এখন ডোনার হিসেবে available" : "তুমি temporarily unavailable হিসেবে সেট হয়েছো");
  };

  // Eligibility calculation
  const lastDonationDate = new Date(MOCK_PROFILE.lastDonation);
  const daysSince = Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(NEXT_ELIGIBLE_DAYS - daysSince, 0);
  const isEligible = daysRemaining === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 pb-20 pt-10">
      <div className="mx-auto max-w-2xl space-y-4">
        {/* ---------- Profile card ---------- */}
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-[0_8px_30px_rgba(220,38,38,0.08)]">
          <div className="relative mx-auto w-fit">
            {loading ? (
              <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />
            ) :
              !user ? <MdOutlineManageAccounts className="text-[90px] bg-red-600 rounded-full text-white" />
                :
                user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Profile"}
                    referrerPolicy="no-referrer"
                    className="h-24 w-24 rounded-full border-4 border-red-100 object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-red-100 bg-red-600 text-4xl font-bold text-white">
                    {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
            {
              user ?
                <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg">
                  {form.bloodGroup}
                </span>
                :
                ''
            }
          </div>

          <h1 className="mt-4 flex items-center justify-center gap-2 text-xl font-extrabold text-gray-900">
            {user?.displayName || "No Name"}
            {/* {!editing && (
              <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-red-600">
                <HiOutlinePencil className="text-base" />
              </button>
            )} */}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {form.district && form.area ? `${form.area}, ${form.district}` : "Blood Donor"}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {!user?.emailVerified && (
              <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                Email verify করা হয়নি
              </span>
            )}
            {user?.emailVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                <HiOutlineShieldCheck className="text-sm" />
                Verified
              </span>
            )}
          </div>

          {/* Availability toggle */}
          <button

            className={`mt-5 flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${available ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50"
              }`}
          >
            <span className={`text-sm font-semibold ${available ? "text-emerald-700" : "text-gray-500"}`}>
              {available ? "Available to Donate" : "Currently Unavailable"}
            </span>
            <span
              onClick={handleToggleAvailable}
              className={`relative h-6 w-11 rounded-full transition ${available ? "bg-emerald-500" : "bg-gray-300"
                }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${available ? "translate-x-5" : "translate-x-0"
                  }`}
              />
            </span>
          </button>
        </div>

        {/* ---------- Stats ---------- */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-red-100 bg-white p-4 text-center shadow-sm">
            <RiDropFill className="mx-auto mb-1 text-xl text-red-500" />
            <p className="text-lg font-extrabold text-gray-900">{MOCK_PROFILE.totalDonations}</p>
            <p className="text-xs text-gray-400">Total Donations</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-4 text-center shadow-sm">
            <FaMedal className="mx-auto mb-1 text-xl text-amber-500" />
            <p className="text-lg font-extrabold text-gray-900">{MOCK_PROFILE.totalDonations * 3}</p>
            <p className="text-xs text-gray-400">Lives Impacted</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-4 text-center shadow-sm">
            <HiOutlineCalendar className="mx-auto mb-1 text-xl text-sky-500" />
            <p className="text-lg font-extrabold text-gray-900">{daysSince}</p>
            <p className="text-xs text-gray-400">Days Since Last</p>
          </div>
        </div>

        {/* ---------- Eligibility ---------- */}
        <div
          className={`rounded-2xl border p-5 shadow-sm ${isEligible ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
            }`}
        >
          <div className="flex items-center gap-3">
            <HiOutlineCheckCircle
              className={`text-2xl ${isEligible ? "text-emerald-600" : "text-amber-600"}`}
            />
            <div>
              <p className={`font-bold ${isEligible ? "text-emerald-700" : "text-amber-700"}`}>
                {isEligible ? "You're eligible to donate now" : "Not eligible yet"}
              </p>
              <p className="text-sm text-gray-600">
                {isEligible
                  ? "It's been over 90 days since your last donation."
                  : `${daysRemaining} more day(s) until your next eligible donation.`}
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Edit / Info form ---------- */}
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Personal Information</h2>
            {editing ? (
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                <HiOutlineX className="text-lg" />
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">District</label>
                  <input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Area</label>
                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="flex items-center gap-3 py-3">
                <HiOutlineMail className="text-lg text-gray-400" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <HiOutlinePhone className="text-lg text-gray-400" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{form.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <HiOutlineLocationMarker className="text-lg text-gray-400" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm font-medium text-gray-800">
                    {form.area}, {form.district}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Donation history ---------- */}
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-gray-900">Donation History</h2>

          {MOCK_HISTORY.length === 0 ? (
            <p className="text-sm text-gray-400">এখনো কোনো ডোনেশন রেকর্ড নেই।</p>
          ) : (
            <ul className="space-y-3">
              {MOCK_HISTORY.map((h, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-rose-50/50 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                    <RiDropFill />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">{h.location}</p>
                    <p className="text-xs text-gray-400">
                      {h.recipient} • {h.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ---------- Logout ---------- */}
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