import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../providers/AuthProviders";
import { useNavigate } from "react-router-dom";
import {
  SquarePen,
  Trash2,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import MyPostSkeleton from "../component/MyPostSkeleton";


/* =========================================================
   Skeleton List
========================================================= */

const MyPostsSkeleton = () => {
  return (
    <div className="space-y-4">
      <MyPostSkeleton />
      <MyPostSkeleton />
      <MyPostSkeleton />
    </div>
  );
};


/* =========================================================
   Empty State
========================================================= */

const EmptyPosts = ({ onCreate }) => {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
      <SquarePen className="mx-auto mb-3 h-10 w-10 text-red-400" />

      <h2 className="font-bold text-gray-800">
        No Posts Yet
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        আপনি এখনো কোনো blood request post করেননি।
      </p>

      <button
        onClick={onCreate}
        className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95"
      >
        Create Blood Request
      </button>
    </div>
  );
};


/* =========================================================
   Error State
========================================================= */

const PostsError = ({ message, onRetry }) => {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />

      <h2 className="font-bold text-gray-800">
        Posts Load Failed
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        {message || "আপনার posts load করা যায়নি।"}
      </p>

      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
};


/* =========================================================
   Main Component
========================================================= */

const MyPosts = () => {
  const { user, loading } = useContext(AuthContext);

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  const [postLoading, setPostLoading] = useState(false);

  const [postError, setPostError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  /*
    Prevent unnecessary request problems
    when component is mounted/unmounted quickly.
  */
  const abortControllerRef = useRef(null);


  /* =========================================================
     Fetch My Posts
  ========================================================= */

  const fetchMyPosts = async () => {
    if (!user?.email) {
      setPostLoading(false);
      return;
    }

    /*
      Cancel previous request if there is one.
    */

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;

    try {
      setPostLoading(true);
      setPostError("");

      const email = encodeURIComponent(
        user.email.trim().toLowerCase()
      );

      const url = `${
        import.meta.env.VITE_API_URL
      }/blood-requests/user/${email}`;

      /* =========================
         Debug
      ========================= */

      console.log("================================");
      console.log("MY POSTS FETCH START");
      console.log("Auth:", loading ? "LOADING" : "READY");
      console.log("User:", user?.email);
      console.log("Posts:", "LOADING");
      console.log("URL:", url);
      console.log("================================");


      const res = await fetch(url, {
        method: "GET",
        signal: controller.signal,

        headers: {
          Accept: "application/json",
        },
      });


      console.log("MY POSTS STATUS:", res.status);


      if (!res.ok) {
        throw new Error(
          `Server responded with ${res.status}`
        );
      }


      const data = await res.json();


      console.log("MY POSTS DATA:", data);


      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid response received from server"
        );
      }


      /*
        Set data first.
      */

      setPosts(data);


      console.log("MY POSTS DATA LENGTH:", data.length);


    } catch (error) {

      /*
        Abort error is not a real error.
      */

      if (error.name === "AbortError") {
        console.log(
          "Previous MyPosts request cancelled."
        );

        return;
      }


      console.error(
        "MY POSTS ERROR:",
        error
      );


      setPostError(
        error.message ||
        "Failed to load your posts"
      );


      toast.error(
        "Posts load করতে সমস্যা হয়েছে"
      );

    } finally {

      /*
        Only change loading state if
        this request wasn't cancelled.
      */

      if (!controller.signal.aborted) {
        setPostLoading(false);

        console.log("================================");
        console.log("MY POSTS LOADING FALSE");
        console.log("================================");
      }
    }
  };


  /* =========================================================
     Auth + Fetch Effect
  ========================================================= */

  useEffect(() => {

    /*
      Auth এখনও loading হলে
      API call করবো না.
    */

    if (loading) {
      console.log(
        "Auth still loading..."
      );

      return;
    }


    /*
      User না থাকলে login page.
    */

    if (!user?.email) {
      setPostLoading(false);

      return;
    }


    fetchMyPosts();


    /*
      Cleanup
    */

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

  }, [loading, user?.email]);


  /* =========================================================
     Delete Post
  ========================================================= */

  const handleDelete = async (id) => {

    if (!id) return;


    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );


    if (!confirmDelete) return;


    try {

      setDeletingId(id);


      const email = encodeURIComponent(
        user.email.trim().toLowerCase()
      );


      const url = `${
        import.meta.env.VITE_API_URL
      }/blood-requests/${id}?email=${email}`;


      console.log(
        "DELETE POST:",
        id
      );


      const res = await fetch(url, {
        method: "DELETE",

        headers: {
          Accept: "application/json",
        },
      });


      /*
        Server যদি JSON না দেয়
        তাহলে json() error prevent করার জন্য
        text দিয়ে read করছি।
      */

      const text = await res.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {
          message:
            text || "Invalid server response",
        };
      }


      if (!res.ok) {
        throw new Error(
          data.message ||
          `Delete failed (${res.status})`
        );
      }


      /*
        Remove immediately from UI.
      */

      setPosts((prev) =>
        prev.filter(
          (post) => post._id !== id
        )
      );


      toast.success(
        "Post deleted successfully"
      );


    } catch (error) {

      console.error(
        "Delete error:",
        error
      );


      toast.error(
        error.message ||
        "Post delete করতে সমস্যা হয়েছে"
      );

    } finally {

      setDeletingId(null);
    }
  };


  /* =========================================================
     Login Redirect
  ========================================================= */

  useEffect(() => {

    if (!loading && !user) {
      navigate("/login", {
        replace: true,
      });
    }

  }, [loading, user, navigate]);


  /* =========================================================
     Initial Auth Loading
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 pb-20 pt-10">
        <div className="mx-auto max-w-2xl">

          {/* Header Skeleton */}

          <div className="mb-5 flex items-center gap-3">

            <div className="h-10 w-10 rounded-xl bg-gray-200 skeleton" />

            <div>
              <div className="h-5 w-36 rounded bg-gray-200 skeleton" />

              <div className="mt-2 h-3 w-20 rounded bg-gray-200 skeleton" />
            </div>

          </div>


          <MyPostsSkeleton />

        </div>
      </div>
    );
  }


  /* =========================================================
     No User
  ========================================================= */

  if (!user) {
    return null;
  }


  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 pb-20 pt-10">

      <div className="mx-auto max-w-2xl">


        {/* =================================================
            Header
        ================================================= */}

        <div className="mb-5 flex items-center gap-3">

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>


          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              My Blood Posts
            </h1>

            <p className="text-sm text-gray-500">

              {postLoading
                ? "Loading posts..."
                : `${posts.length} post${
                    posts.length !== 1
                      ? "s"
                      : ""
                  }`}

            </p>
          </div>

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        {postLoading ? (


          <MyPostsSkeleton />

        ) : postError ? (

          /*
            Error
          */

          <PostsError
            message={postError}
            onRetry={fetchMyPosts}
          />

        ) : posts.length === 0 ? (

          /*
            Empty
          */

          <EmptyPosts
            onCreate={() =>
              navigate("/create-request")
            }
          />

        ) : (

          /*
            Posts
          */

          <div className="space-y-4">

            {posts.map((post) => (

              <div
                key={post._id}
                className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
              >

                {/* =========================================
                    Top
                ========================================= */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      {/* Blood Group */}

                      <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                        {post.bloodGroup}
                      </span>


                      {/* Status */}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          post.status === "open"
                            ? "bg-emerald-50 text-emerald-600"
                            : post.status ===
                              "fulfilled"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {post.status}
                      </span>

                    </div>


                    <h2 className="mt-3 break-words text-lg font-bold text-gray-900">
                      {post.patientName ||
                        "Patient"}
                    </h2>

                  </div>

                </div>


                {/* =========================================
                    Details
                ========================================= */}

                <div className="mt-3 space-y-2 text-sm text-gray-600">

                  <p className="break-words">
                    <span className="font-semibold text-gray-800">
                      Problem:
                    </span>{" "}
                    {post.patientProblem ||
                      "Not specified"}
                  </p>


                  <p className="break-words">
                    <span className="font-semibold text-gray-800">
                      Location:
                    </span>{" "}
                    {post.area
                      ? post.district
                        ? `${post.area}, ${post.district}`
                        : post.area
                      : post.district ||
                        "Not specified"}
                  </p>


                  <p className="break-words">
                    <span className="font-semibold text-gray-800">
                      Hospital:
                    </span>{" "}
                    {post.hospital ||
                      "Not specified"}
                  </p>


                  <p>
                    <span className="font-semibold text-gray-800">
                      Units:
                    </span>{" "}
                    {post.unitsNeeded || 1}
                  </p>

                </div>


                {/* =========================================
                    Buttons
                ========================================= */}

                <div className="mt-5 flex gap-3">

                  {/* Edit */}

                  <button
                    onClick={() =>
                      navigate(
                        `/edit-post/${post._id}`
                      )
                    }
                    disabled={
                      deletingId ===
                      post._id
                    }
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <SquarePen size={17} />

                    Edit

                  </button>


                  {/* Delete */}

                  <button
                    onClick={() =>
                      handleDelete(
                        post._id
                      )
                    }
                    disabled={
                      deletingId ===
                      post._id
                    }
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {deletingId ===
                    post._id ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />

                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={17} />

                        Delete
                      </>
                    )}

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


// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../providers/AuthProviders";
// import { useNavigate } from "react-router-dom";
// import { SquarePen, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
// import toast from "react-hot-toast";

// /* =========================
//    Skeleton Card
// ========================= */

// const PostSkeleton = ({ index }) => {
//   return (
//     <div
//       className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
//       data-skeleton={`post-${index}`}
//     >
//       {/* Debug label - mobile এ বুঝতে পারবে কোন loading চলছে */}
//       <div className="mb-4 flex items-center justify-between">
//         <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-400">
//           POST SKELETON
//         </span>

//         <span className="text-[10px] font-medium text-gray-400">
//           Loading...
//         </span>
//       </div>

//       {/* Top section */}

//       <div className="flex items-start justify-between gap-3">
//         <div className="w-full">
//           <div className="flex items-center gap-2">
//             <div className="h-6 w-14 rounded-full bg-gray-200" />
//             <div className="h-5 w-16 rounded-full bg-gray-200" />
//           </div>

//           <div className="mt-4 h-6 w-36 rounded-md bg-gray-200" />
//         </div>
//       </div>

//       {/* Details */}

//       <div className="mt-4 space-y-3">
//         <div className="h-4 w-full rounded bg-gray-100" />
//         <div className="h-4 w-4/5 rounded bg-gray-100" />
//         <div className="h-4 w-3/5 rounded bg-gray-100" />
//         <div className="h-4 w-2/5 rounded bg-gray-100" />
//       </div>

//       {/* Buttons */}

//       <div className="mt-5 flex gap-3">
//         <div className="h-10 flex-1 rounded-xl bg-gray-100" />
//         <div className="h-10 flex-1 rounded-xl bg-gray-100" />
//       </div>
//     </div>
//   );
// };


// /* =========================
//    Main Component
// ========================= */

// const MyPosts = () => {
//   const { user, loading: authLoading } = useContext(AuthContext);

//   const navigate = useNavigate();

//   const [posts, setPosts] = useState([]);

//   const [postLoading, setPostLoading] = useState(true);

//   const [postError, setPostError] = useState("");

//   /* =========================
//      Fetch My Posts
//   ========================= */

//   const fetchMyPosts = async () => {
//     if (!user?.email) {
//       console.log("POST_LOADING_SKIP: No user email");
//       return;
//     }

//     const requestUrl = `${
//       import.meta.env.VITE_API_URL
//     }/blood-requests/user/${encodeURIComponent(user.email)}`;

//     console.log("=================================");
//     console.log("POST_LOADING_START");
//     console.log("POST_LOADING_STATE: true");
//     console.log("POST_FETCH_URL:", requestUrl);
//     console.log("=================================");

//     setPostLoading(true);
//     setPostError("");

//     try {
//       const res = await fetch(requestUrl);

//       console.log("POST_RESPONSE_STATUS:", res.status);

//       if (!res.ok) {
//         throw new Error(`Server returned ${res.status}`);
//       }

//       const data = await res.json();

//       console.log("POST_DATA_RECEIVED:", data);
//       console.log("POST_DATA_LENGTH:", data.length);

//       setPosts(data);

//       console.log("POST_LOADING_END");
//       console.log("POST_LOADING_STATE: false");
//     } catch (error) {
//       console.error("POST_FETCH_ERROR:", error);

//       setPostError(
//         error.message || "Posts load করতে সমস্যা হয়েছে"
//       );

//       toast.error("Posts load error");
//     } finally {
//       /*
//        * Important:
//        * API success/error যাই হোক,
//        * loading অবশ্যই false হবে।
//        */

//       setPostLoading(false);

//       console.log("POST_LOADING_FINALLY");
//       console.log("POST_LOADING_STATE: false");
//     }
//   };


//   /* =========================
//      Auth + Posts
//   ========================= */

//   useEffect(() => {
//     if (authLoading) {
//       console.log("AUTH_LOADING: true");
//       return;
//     }

//     console.log("AUTH_LOADING: false");

//     if (!user?.email) {
//       console.log("NO_USER");
//       setPostLoading(false);
//       return;
//     }

//     fetchMyPosts();

//   }, [user?.email, authLoading]);


//   /* =========================
//      Delete
//   ========================= */

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this post?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/blood-requests/${id}?email=${encodeURIComponent(
//           user.email
//         )}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(
//           data.message || "Failed to delete post"
//         );
//       }

//       toast.success("Post deleted successfully");

//       setPosts((prev) =>
//         prev.filter((post) => post._id !== id)
//       );

//     } catch (error) {
//       console.error("Delete error:", error);

//       toast.error(
//         error.message || "Post delete করতে সমস্যা হয়েছে"
//       );
//     }
//   };


//   /* =========================
//      Auth Loading
//   ========================= */

//   if (authLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-rose-50 px-4">
//         <div className="w-full max-w-2xl text-center">

//           <div className="mb-3 text-xs font-bold text-gray-400">
//             AUTH LOADING...
//           </div>

//           <div className="rounded-2xl bg-white p-8 shadow-sm">
//             <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />

//             <p className="mt-4 text-sm text-gray-500">
//               Checking user session...
//             </p>
//           </div>

//         </div>
//       </div>
//     );
//   }


//   /* =========================
//      No User
//   ========================= */

//   if (!user) {
//     navigate("/login", { replace: true });
//     return null;
//   }


//   /* =========================
//      Main UI
//   ========================= */

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 pb-20 pt-10">

//       <div className="mx-auto max-w-2xl">

//         {/* =========================
//             Header
//         ========================= */}

//         <div className="mb-5 flex items-center gap-3">

//           <button
//             onClick={() => navigate("/profile")}
//             className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50"
//           >
//             <ArrowLeft />
//           </button>

//           <div>
//             <h1 className="text-xl font-extrabold text-gray-900">
//               My Blood Posts
//             </h1>

//             <p className="text-sm text-gray-500">
//               {postLoading
//                 ? "Loading posts..."
//                 : `${posts.length} post${
//                     posts.length !== 1 ? "s" : ""
//                   }`}
//             </p>
//           </div>

//         </div>


//         {/* =========================
//             DEBUG STATUS
//             Mobile এ temporarily দেখতে পারবে
//         ========================= */}

//         <div className="mb-5 rounded-xl border border-yellow-200 bg-yellow-50 p-3">

//           <p className="text-[11px] font-bold text-yellow-700">
//             DEBUG STATUS
//           </p>

//           <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">

//             <div>
//               Auth:
//               <span className="ml-1 font-bold">
//                 {authLoading ? "LOADING" : "READY"}
//               </span>
//             </div>

//             <div>
//               Posts:
//               <span className="ml-1 font-bold">
//                 {postLoading ? "LOADING" : "READY"}
//               </span>
//             </div>

//             <div>
//               Data:
//               <span className="ml-1 font-bold">
//                 {posts.length}
//               </span>
//             </div>

//             <div>
//               Error:
//               <span className="ml-1 font-bold">
//                 {postError ? "YES" : "NO"}
//               </span>
//             </div>

//           </div>

//         </div>


//         {/* =========================
//             Error UI
//         ========================= */}

//         {postError && !postLoading && (
//           <div className="mb-5 rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">

//             <p className="font-bold text-red-600">
//               Failed to load posts
//             </p>

//             <p className="mt-1 text-sm text-gray-500">
//               {postError}
//             </p>

//             <button
//               onClick={fetchMyPosts}
//               className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
//             >
//               <RefreshCw size={16} />
//               Try Again
//             </button>

//           </div>
//         )}


//         {/* =========================
//             Skeleton
//         ========================= */}

//         {postLoading && !postError && (
//           <div className="space-y-4">

//             <PostSkeleton index={1} />
//             <PostSkeleton index={2} />
//             <PostSkeleton index={3} />

//           </div>
//         )}


//         {/* =========================
//             Empty State
//         ========================= */}

//         {!postLoading &&
//           !postError &&
//           posts.length === 0 && (

//             <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">

//               <SquarePen className="mx-auto mb-3 text-red-400" />

//               <h2 className="font-bold text-gray-800">
//                 No Posts Yet
//               </h2>

//               <p className="mt-1 text-sm text-gray-500">
//                 আপনি এখনো কোনো blood request post করেননি।
//               </p>

//             </div>
//           )}


//         {/* =========================
//             Posts
//         ========================= */}

//         {!postLoading &&
//           !postError &&
//           posts.length > 0 && (

//             <div className="space-y-4">

//               {posts.map((post) => (

//                 <div
//                   key={post._id}
//                   className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
//                 >

//                   {/* Top */}

//                   <div className="flex items-start justify-between gap-3">

//                     <div>

//                       <div className="flex items-center gap-2">

//                         <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
//                           {post.bloodGroup}
//                         </span>

//                         <span
//                           className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                             post.status === "open"
//                               ? "bg-emerald-50 text-emerald-600"
//                               : post.status === "fulfilled"
//                               ? "bg-blue-50 text-blue-600"
//                               : "bg-gray-100 text-gray-500"
//                           }`}
//                         >
//                           {post.status}
//                         </span>

//                       </div>

//                       <h2 className="mt-3 text-lg font-bold text-gray-900">
//                         {post.patientName || "Patient"}
//                       </h2>

//                     </div>

//                   </div>


//                   {/* Details */}

//                   <div className="mt-3 space-y-1 text-sm text-gray-600">

//                     <p>
//                       <span className="font-semibold">
//                         Problem:
//                       </span>{" "}
//                       {post.patientProblem}
//                     </p>

//                     <p>
//                       <span className="font-semibold">
//                         Location:
//                       </span>{" "}
//                       {post.area
//                         ? `${post.area}${
//                             post.district
//                               ? `, ${post.district}`
//                               : ""
//                           }`
//                         : post.district || "Not specified"}
//                     </p>

//                     <p>
//                       <span className="font-semibold">
//                         Hospital:
//                       </span>{" "}
//                       {post.hospital || "Not specified"}
//                     </p>

//                     <p>
//                       <span className="font-semibold">
//                         Units:
//                       </span>{" "}
//                       {post.unitsNeeded}
//                     </p>

//                   </div>


//                   {/* Buttons */}

//                   <div className="mt-5 flex gap-3">

//                     <button
//                       onClick={() =>
//                         navigate(`/edit-post/${post._id}`)
//                       }
//                       className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
//                     >
//                       <SquarePen size={17} />
//                       Edit
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleDelete(post._id)
//                       }
//                       className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
//                     >
//                       <Trash2 size={17} />
//                       Delete
//                     </button>

//                   </div>

//                 </div>

//               ))}

//             </div>
//           )}

//       </div>
//     </div>
//   );
// };

// export default MyPosts;


// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../providers/AuthProviders";
// import { useNavigate } from "react-router-dom";
// import { SquarePen, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
// import toast from "react-hot-toast";


// // ======================================================
// // POST SKELETON
// // ======================================================

// const PostSkeleton = () => {
//   return (
//     <div className="animate-pulse rounded-2xl border border-red-100 bg-white p-5 shadow-sm">

//       {/* Top */}

//       <div className="flex items-start justify-between gap-3">

//         <div className="w-full">

//           <div className="flex items-center gap-2">

//             {/* Blood group skeleton */}

//             <div className="h-7 w-14 rounded-full bg-gray-200" />

//             {/* Status skeleton */}

//             <div className="h-6 w-20 rounded-full bg-gray-200" />

//           </div>

//           {/* Patient name */}

//           <div className="mt-4 h-6 w-40 rounded-md bg-gray-200" />

//         </div>

//       </div>


//       {/* Details */}

//       <div className="mt-5 space-y-3">

//         <div className="h-4 w-full rounded bg-gray-200" />

//         <div className="h-4 w-5/6 rounded bg-gray-200" />

//         <div className="h-4 w-4/6 rounded bg-gray-200" />

//         <div className="h-4 w-2/6 rounded bg-gray-200" />

//       </div>


//       {/* Buttons */}

//       <div className="mt-5 flex gap-3">

//         <div className="h-10 flex-1 rounded-xl bg-gray-200" />

//         <div className="h-10 flex-1 rounded-xl bg-gray-200" />

//       </div>

//     </div>
//   );
// };


// // ======================================================
// // POSTS SKELETON LIST
// // ======================================================

// const PostsSkeleton = () => {
//   return (
//     <div className="space-y-4">

//       <PostSkeleton />
//       <PostSkeleton />
//       <PostSkeleton />

//     </div>
//   );
// };


// // ======================================================
// // AUTH LOADING
// // ======================================================

// const AuthLoading = () => {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">

//       <div className="w-full max-w-sm rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

//         <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />

//         <p className="mt-4 text-sm font-semibold text-gray-700">
//           Authentication Loading
//         </p>

//         <p className="mt-1 text-xs text-gray-400">
//           Checking your account...
//         </p>

//       </div>

//     </div>
//   );
// };


// // ======================================================
// // ERROR UI
// // ======================================================

// const PostsError = ({ error, onRetry }) => {
//   return (
//     <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

//       <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">

//         <RefreshCw className="text-red-500" />

//       </div>

//       <h2 className="mt-4 font-bold text-gray-900">
//         Failed to load posts
//       </h2>

//       <p className="mt-1 text-sm text-gray-500">
//         {error || "Something went wrong while loading your posts."}
//       </p>

//       <button
//         onClick={onRetry}
//         className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
//       >
//         <RefreshCw size={16} />
//         Try Again
//       </button>

//     </div>
//   );
// };


// // ======================================================
// // MY POSTS
// // ======================================================

// const MyPosts = () => {

//   const { user, loading } = useContext(AuthContext);

//   const navigate = useNavigate();


//   // ====================================================
//   // STATES
//   // ====================================================

//   const [posts, setPosts] = useState([]);

//   const [postLoading, setPostLoading] = useState(true);

//   const [postError, setPostError] = useState("");

//   // Debug state
//   const [loadingStartedAt, setLoadingStartedAt] = useState(null);


//   // ====================================================
//   // FETCH MY POSTS
//   // ====================================================

//   const fetchMyPosts = async () => {

//     if (!user?.email) {
//       setPostLoading(false);
//       return;
//     }

//     try {

//       setPostLoading(true);

//       setPostError("");

//       setLoadingStartedAt(Date.now());


//       const url =
//         `${import.meta.env.VITE_API_URL}/blood-requests/user/${encodeURIComponent(
//           user.email
//         )}`;


//       const res = await fetch(url);


//       if (!res.ok) {
//         throw new Error(
//           `Server returned ${res.status}`
//         );
//       }


//       const data = await res.json();


//       if (!Array.isArray(data)) {
//         throw new Error("Invalid posts data received from server");
//       }


//       setPosts(data);


//     } catch (error) {

//       console.error("My posts error:", error);

//       setPosts([]);

//       setPostError(
//         error.message || "Failed to load posts"
//       );

//       toast.error("Posts load error");


//     } finally {

//       setPostLoading(false);

//       setLoadingStartedAt(null);

//     }

//   };


//   // ====================================================
//   // FETCH AFTER AUTH
//   // ====================================================

//   useEffect(() => {

//     if (loading) {
//       return;
//     }


//     if (!user?.email) {

//       setPosts([]);

//       setPostLoading(false);

//       return;

//     }


//     fetchMyPosts();

//   }, [loading, user?.email]);


//   // ====================================================
//   // DEVELOPMENT LOADING DEBUG
//   // ====================================================

//   useEffect(() => {

//     if (!import.meta.env.DEV) {
//       return;
//     }


//     if (!loading && !postLoading) {
//       return;
//     }


//     const timer = setTimeout(() => {

//       console.warn(
//         "⚠️ Loading is taking longer than expected",
//         {
//           authLoading: loading,
//           postsLoading: postLoading,
//           userEmail: user?.email || null,
//           loadingStartedAt,
//         }
//       );

//     }, 3000);


//     return () => clearTimeout(timer);

//   }, [
//     loading,
//     postLoading,
//     user?.email,
//     loadingStartedAt,
//   ]);


//   // ====================================================
//   // DELETE POST
//   // ====================================================

//   const handleDelete = async (id) => {

//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this post?"
//     );


//     if (!confirmDelete) {
//       return;
//     }


//     try {

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/blood-requests/${id}?email=${encodeURIComponent(
//           user.email
//         )}`,
//         {
//           method: "DELETE",
//         }
//       );


//       const data = await res.json();


//       if (!res.ok) {

//         throw new Error(
//           data.message || "Failed to delete post"
//         );

//       }


//       toast.success("Post deleted successfully");


//       setPosts((prev) =>
//         prev.filter((post) => post._id !== id)
//       );


//     } catch (error) {

//       console.error("Delete error:", error);

//       toast.error(
//         error.message ||
//         "Post delete করতে সমস্যা হয়েছে"
//       );

//     }

//   };


//   // ====================================================
//   // AUTH LOADING
//   // ====================================================

//   if (loading) {

//     return <AuthLoading />;

//   }


//   // ====================================================
//   // NO USER
//   // ====================================================

//   if (!user) {

//     navigate("/login");

//     return null;

//   }


//   // ====================================================
//   // MAIN UI
//   // ====================================================

//   return (

//     <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 pb-20 pt-10">

//       <div className="mx-auto max-w-2xl">


//         {/* ==============================================
//             HEADER
//         ============================================== */}

//         <div className="mb-5 flex items-center gap-3">

//           <button
//             onClick={() => navigate("/profile")}
//             className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50"
//           >

//             <ArrowLeft size={20} />

//           </button>


//           <div>

//             <h1 className="text-xl font-extrabold text-gray-900">
//               My Blood Posts
//             </h1>

//             <p className="text-sm text-gray-500">

//               {postLoading
//                 ? "Loading your posts..."
//                 : `${posts.length} post${
//                     posts.length !== 1 ? "s" : ""
//                   }`}

//             </p>

//           </div>

//         </div>


//         {/* ==============================================
//             DEVELOPMENT LOADING DEBUG
//         ============================================== */}

//         {import.meta.env.DEV &&
//           (loading || postLoading) && (

//             <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 p-4">

//               <p className="text-xs font-bold text-yellow-800">
//                 🔍 DEBUG — Loading State
//               </p>

//               <div className="mt-2 space-y-1 text-xs text-yellow-700">

//                 <p>
//                   Authentication Loading:
//                   <strong className="ml-1">
//                     {loading ? "TRUE" : "FALSE"}
//                   </strong>
//                 </p>

//                 <p>
//                   Posts Loading:
//                   <strong className="ml-1">
//                     {postLoading ? "TRUE" : "FALSE"}
//                   </strong>
//                 </p>

//                 <p>
//                   User:
//                   <strong className="ml-1">
//                     {user?.email || "NULL"}
//                   </strong>
//                 </p>

//                 <p>
//                   Posts:
//                   <strong className="ml-1">
//                     {posts.length}
//                   </strong>
//                 </p>

//               </div>

//             </div>

//           )}


//         {/* ==============================================
//             POSTS ERROR
//         ============================================== */}

//         {postError ? (

//           <PostsError
//             error={postError}
//             onRetry={fetchMyPosts}
//           />

//         ) : postLoading ? (

//           /* ============================================
//              POSTS SKELETON
//           ============================================ */

//           <PostsSkeleton />

//         ) : posts.length === 0 ? (

//           /* ============================================
//              NO POSTS
//           ============================================ */

//           <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">

//             <SquarePen className="mx-auto mb-3 text-4xl text-red-400" />

//             <h2 className="font-bold text-gray-800">
//               No Posts Yet
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               আপনি এখনো কোনো blood request post করেননি।
//             </p>

//           </div>

//         ) : (

//           /* ============================================
//              POSTS
//           ============================================ */

//           <div className="space-y-4">

//             {posts.map((post) => (

//               <div
//                 key={post._id}
//                 className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
//               >

//                 {/* Top */}

//                 <div className="flex items-start justify-between gap-3">

//                   <div>

//                     <div className="flex items-center gap-2">

//                       <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
//                         {post.bloodGroup}
//                       </span>


//                       <span
//                         className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                           post.status === "open"
//                             ? "bg-emerald-50 text-emerald-600"
//                             : post.status === "fulfilled"
//                               ? "bg-blue-50 text-blue-600"
//                               : "bg-gray-100 text-gray-500"
//                         }`}
//                       >
//                         {post.status}
//                       </span>

//                     </div>


//                     <h2 className="mt-3 text-lg font-bold text-gray-900">
//                       {post.patientName || "Patient"}
//                     </h2>

//                   </div>

//                 </div>


//                 {/* Details */}

//                 <div className="mt-3 space-y-1 text-sm text-gray-600">

//                   <p>
//                     <span className="font-semibold">
//                       Problem:
//                     </span>{" "}
//                     {post.patientProblem}
//                   </p>


//                   <p>
//                     <span className="font-semibold">
//                       Location:
//                     </span>{" "}
//                     {post.area
//                       ? `${post.area}, ${post.district}`
//                       : post.district}
//                   </p>


//                   <p>
//                     <span className="font-semibold">
//                       Hospital:
//                     </span>{" "}
//                     {post.hospital || "Not specified"}
//                   </p>


//                   <p>
//                     <span className="font-semibold">
//                       Units:
//                     </span>{" "}
//                     {post.unitsNeeded}
//                   </p>

//                 </div>


//                 {/* Buttons */}

//                 <div className="mt-5 flex gap-3">

//                   <button
//                     onClick={() =>
//                       navigate(`/edit-post/${post._id}`)
//                     }
//                     className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
//                   >

//                     <SquarePen size={17} />

//                     Edit

//                   </button>


//                   <button
//                     onClick={() =>
//                       handleDelete(post._id)
//                     }
//                     className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
//                   >

//                     <Trash2 size={17} />

//                     Delete

//                   </button>

//                 </div>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     </div>

//   );

// };

// export default MyPosts;

