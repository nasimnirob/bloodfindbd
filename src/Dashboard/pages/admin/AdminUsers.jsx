import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [roleUpdating, setRoleUpdating] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (search) {
                params.append("search", search);
            }

            const res = await fetch(
                `${API_URL}/admin/users?${params.toString()}`
            );

            const data = await res.json();

            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };


    // =========================
    // CHANGE USER ROLE
    // =========================
    const changeRole = async (id, role) => {
        try {
            setRoleUpdating(id);

            const res = await fetch(
                `${API_URL}/admin/users/${id}/role`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        role,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            // Update frontend immediately
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id
                        ? {
                              ...user,
                              role,
                          }
                        : user
                )
            );

        } catch (error) {
            console.error(
                "Role update error:",
                error
            );

            alert("Failed to update role");

        } finally {
            setRoleUpdating(null);
        }
    };


    // =========================
    // DELETE USER
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `${API_URL}/admin/users/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (res.ok) {
                setUsers((prev) =>
                    prev.filter(
                        (user) => user._id !== id
                    )
                );

                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Users
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage registered users.
                </p>
            </div>


            {/* Search */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search name, email, phone, district..."
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />

                    <button
                        type="submit"
                        className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Search
                    </button>
                </form>
            </div>


            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1150px]">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    User
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Phone
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Blood
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Location
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Donations
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Status
                                </th>

                                {/* NEW */}
                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Role
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-5 py-10 text-center text-gray-400"
                                    >
                                        Loading users...
                                    </td>
                                </tr>

                            ) : users.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-5 py-10 text-center text-gray-400"
                                    >
                                        No users found.
                                    </td>
                                </tr>

                            ) : (

                                users.map((user) => (

                                    <tr
                                        key={user._id}
                                        className="hover:bg-gray-50"
                                    >

                                        {/* USER */}
                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <img
                                                    src={
                                                        user.photoURL ||
                                                        "https://i.ibb.co/4pDNDk1/avatar.png"
                                                    }
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />

                                                <div>

                                                    <p className="font-medium text-gray-800">
                                                        {user.name}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        {user.email}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* PHONE */}
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {user.phone || "N/A"}
                                        </td>


                                        {/* BLOOD */}
                                        <td className="px-5 py-4">

                                            <span className="rounded-lg bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                                                {user.bloodGroup || "N/A"}
                                            </span>

                                        </td>


                                        {/* LOCATION */}
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {user.district || "N/A"}
                                        </td>


                                        {/* DONATIONS */}
                                        <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                                            {user.totalDonations || 0}
                                        </td>


                                        {/* STATUS */}
                                        <td className="px-5 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    user.available
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {user.available
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>

                                        </td>


                                        {/* ROLE */}
                                        <td className="px-5 py-4">

                                            {user.role === "superAdmin" ? (

                                                <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                                                    Super Admin
                                                </span>

                                            ) : (

                                                <select
                                                    value={
                                                        user.role ||
                                                        "user"
                                                    }
                                                    disabled={
                                                        roleUpdating ===
                                                        user._id
                                                    }
                                                    onChange={(e) =>
                                                        changeRole(
                                                            user._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                >

                                                    <option value="user">
                                                        User
                                                    </option>

                                                    <option value="admin">
                                                        Admin
                                                    </option>

                                                </select>

                                            )}

                                        </td>


                                        {/* DELETE */}
                                        <td className="px-5 py-4">

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        user._id
                                                    )
                                                }
                                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default AdminUsers;