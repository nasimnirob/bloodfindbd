import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProviders";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const EditPost = () => {
  const { user, loading } = useContext(AuthContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const [postLoading, setPostLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patientName: "",
    patientProblem: "",
    bloodGroup: "",
    district: "",
    area: "",
    hospital: "",
    contactPhone: "",
    unitsNeeded: 1,
    urgency: "normal",
    neededOn: "",
    note: "",
  });

  // Fetch post
  useEffect(() => {
    if (loading || !user?.email || !id) return;

    const fetchPost = async () => {
      try {
        setPostLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/blood-requests/${id}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Post not found");
        }

        // Security check
        if (
          data.requesterEmail?.toLowerCase() !==
          user.email.toLowerCase()
        ) {
          toast.error("You cannot edit this post");
          navigate("/my-posts");
          return;
        }

        setForm({
          patientName: data.patientName || "",
          patientProblem: data.patientProblem || "",
          bloodGroup: data.bloodGroup || "",
          district: data.district || "",
          area: data.area || "",
          hospital: data.hospital || "",
          contactPhone: data.contactPhone || "",
          unitsNeeded: data.unitsNeeded || 1,
          urgency: data.urgency || "normal",
          neededOn: data.neededOn
            ? data.neededOn.slice(0, 10)
            : "",
          note: data.note || "",
        });

      } catch (error) {
        console.error("Fetch post error:", error);
        toast.error(error.message || "Post load failed");
        navigate("/my-posts");
      } finally {
        setPostLoading(false);
      }
    };

    fetchPost();
  }, [id, user?.email, loading]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("User not found");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blood-requests/${id}?email=${encodeURIComponent(
          user.email
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update post"
        );
      }

      toast.success("Post updated successfully");

      navigate("/my-posts");

    } catch (error) {
      console.error("Update error:", error);

      toast.error(
        error.message || "Post update করতে সমস্যা হয়েছে"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || postLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 pb-20 pt-10">

      <div className="mx-auto max-w-2xl">

        {/* Header */}

        <div className="mb-5 flex items-center gap-3">

          <button
            onClick={() => navigate("/my-posts")}
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              Edit Blood Post
            </h1>

            <p className="text-sm text-gray-500">
              Update your blood request
            </p>
          </div>

        </div>


        {/* Form */}

        <form
          onSubmit={handleUpdate}
          className="space-y-5 rounded-2xl border border-red-100 bg-white p-6 shadow-sm"
        >

          {/* Patient Name */}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Patient Name
            </label>

            <input
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>


          {/* Problem */}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Patient Problem
            </label>

            <textarea
              name="patientProblem"
              value={form.patientProblem}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>


          {/* Blood + Units */}

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Blood Group
              </label>

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              >
                <option value="">Select</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>


            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Units Needed
              </label>

              <input
                type="number"
                min="1"
                name="unitsNeeded"
                value={form.unitsNeeded}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>

          </div>


          {/* District + Area */}

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                District
              </label>

              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Area
              </label>

              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>

          </div>


          {/* Hospital */}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Hospital
            </label>

            <input
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>


          {/* Phone */}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Contact Phone
            </label>

            <input
              type="tel"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>


          {/* Urgency */}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Urgency
            </label>

            <select
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            >
              <option value="normal">
                Normal
              </option>

              <option value="urgent">
                Urgent
              </option>

              <option value="critical">
                Critical
              </option>
            </select>
          </div>


          {/* Needed On */}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Needed On
            </label>

            <input
              type="date"
              name="neededOn"
              value={form.neededOn}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>


          {/* Note */}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Note
            </label>

            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>


          {/* Buttons */}

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={() => navigate("/my-posts")}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Post"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditPost;