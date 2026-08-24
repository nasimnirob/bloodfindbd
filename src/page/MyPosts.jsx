import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProviders";
import { useNavigate } from "react-router-dom";
import { SquarePen, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const MyPosts = () => {
  const { user, loading } = useContext(AuthContext);

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);

  const fetchMyPosts = async () => {
    if (!user?.email) return;

    try {
      setPostLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blood-requests/user/${encodeURIComponent(
          user.email
        )}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();

      setPosts(data);
    } catch (error) {
      console.error("My posts error:", error);
      toast.error("Posts load error");
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.email) {
      fetchMyPosts();
    }
  }, [user?.email, loading]);

  // Delete post

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blood-requests/${id}?email=${encodeURIComponent(
          user.email
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      toast.success("Post deleted successfully");

      setPosts((prev) =>
        prev.filter((post) => post._id !== id)
      );

    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Post delete করতে সমস্যা হয়েছে");
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
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft />
          </button>

          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              My Blood Posts
            </h1>

            <p className="text-sm text-gray-500">
              {posts.length} post{posts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* No Posts */}

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">

            <SquarePen className="mx-auto mb-3 text-4xl text-red-400" />

            <h2 className="font-bold text-gray-800">
              No Posts Yet
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              আপনি এখনো কোনো blood request post করেননি।
            </p>

          </div>
        ) : (

          /* Posts */

          <div className="space-y-4">

            {posts.map((post) => (

              <div
                key={post._id}
                className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
              >

                {/* Top */}

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <div className="flex items-center gap-2">

                      <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                        {post.bloodGroup}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${post.status === "open"
                            ? "bg-emerald-50 text-emerald-600"
                            : post.status === "fulfilled"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {post.status}
                      </span>

                    </div>

                    <h2 className="mt-3 text-lg font-bold text-gray-900">
                      {post.patientName || "Patient"}
                    </h2>
                  </div>

                </div>

                {/* Details */}

                <div className="mt-3 space-y-1 text-sm text-gray-600">

                  <p>
                    <span className="font-semibold">
                      Problem:
                    </span>{" "}
                    {post.patientProblem}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Location:
                    </span>{" "}
                    {post.area
                      ? `${post.area}, ${post.district}`
                      : post.district}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Hospital:
                    </span>{" "}
                    {post.hospital || "Not specified"}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Units:
                    </span>{" "}
                    {post.unitsNeeded}
                  </p>

                </div>

                {/* Buttons */}

                <div className="mt-5 flex gap-3">

                  <button
                    onClick={() =>
                      navigate(`/edit-post/${post._id}`)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <SquarePen size={17} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyPosts;