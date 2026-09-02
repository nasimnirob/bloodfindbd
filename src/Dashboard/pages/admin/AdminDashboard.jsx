import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import { MdBloodtype, MdCancel, MdPeopleOutline } from "react-icons/md";
import { PiDropDuotone } from "react-icons/pi";
import { BiDonateHeart } from "react-icons/bi";
import { IoIosDoneAll } from "react-icons/io";


const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/admin/dashboard`
                );

                const result = await res.json();

                setData(result);
            } catch (error) {
                console.error(
                    "Dashboard fetch error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 skeleton rounded bg-gray-200" />

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            key={item}
                            className="h-32 skeleton rounded-2xl bg-gray-200"
                        />
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="h-80 skeleton rounded-2xl bg-gray-200" />
                    <div className="h-80 skeleton rounded-2xl bg-gray-200" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-gray-500">
                    Failed to load dashboard data.
                </p>
            </div>
        );
    }

    const stats = data.statistics;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Dashboard Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Monitor your Blood Find BD platform.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon= {<MdPeopleOutline></MdPeopleOutline>}
                    description="Registered users"
                />

                <StatCard
                    title="Available Donors"
                    value={stats.totalDonors}
                    icon={<PiDropDuotone></PiDropDuotone>}
                    description="Currently available"
                />

                <StatCard
                    title="Blood Requests"
                    value={stats.totalRequests}
                    icon={<BiDonateHeart></BiDonateHeart>}
                    description="Total requests"
                />

                <StatCard
                    title="Open Requests"
                    value={stats.openRequests}
                    icon={<MdBloodtype></MdBloodtype>}
                    description="Need attention"
                />

                <StatCard
                    title="Fulfilled"
                    value={stats.fulfilledRequests}
                    icon={<IoIosDoneAll></IoIosDoneAll>}
                    description="Successfully completed"
                />

                <StatCard
                    title="Cancelled"
                    value={stats.cancelledRequests}
                    icon={<MdCancel></MdCancel>}
                    description="Cancelled requests"
                />
            </div>

            {/* Blood Group + District */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Blood Groups */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-900">
                            Donors by Blood Group
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                            Available donor distribution
                        </p>
                    </div>

                    <div className="space-y-5">
                        {data.bloodGroupStats?.map((item) => {

                            const max =
                                data.bloodGroupStats[0]?.count || 1;

                            const width =
                                (item.count / max) * 100;

                            return (
                                <div key={item._id}>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-semibold text-gray-700">
                                            {item._id}
                                        </span>

                                        <span className="text-gray-500">
                                            {item.count}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            style={{
                                                width: `${width}%`,
                                            }}
                                            className="h-full rounded-full bg-red-500"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* District */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-900">
                            Top Districts
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                            Donor distribution by district
                        </p>
                    </div>

                    <div className="space-y-4">
                        {data.districtStats?.map(
                            (item, index) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-700">
                                                {item._id}
                                            </span>

                                            <span className="text-sm font-semibold text-gray-900">
                                                {item.count}
                                            </span>
                                        </div>

                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className="h-full rounded-full bg-gray-800"
                                                style={{
                                                    width: `${
                                                        (item.count /
                                                            (data.districtStats[0]
                                                                ?.count ||
                                                                1)) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <div>
                        <h3 className="font-bold text-gray-900">
                            Recent Users
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                            Latest registered users
                        </p>
                    </div>

                    <a
                        href="/admin/users"
                        className="text-sm font-medium text-red-600 hover:underline"
                    >
                        View all
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                                    User
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                                    Blood
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                                    District
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {data.recentUsers?.map((user) => (
                                <tr
                                    key={user._id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    user.photoURL ||
                                                    "https://i.ibb.co/4pDNDk1/avatar.png"
                                                }
                                                alt=""
                                                className="h-10 w-10 rounded-full object-cover"
                                            />

                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {user.name ||
                                                        "Unknown"}
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-lg bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                                            {user.bloodGroup ||
                                                "N/A"}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {user.district ||
                                            "N/A"}
                                    </td>

                                    <td className="px-5 py-4">
                                        {user.available ? (
                                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                                                Available
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                                                Unavailable
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Requests */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900">
                        Recent Blood Requests
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                        Latest blood requests
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs uppercase text-gray-400">
                                    Patient
                                </th>

                                <th className="px-5 py-3 text-left text-xs uppercase text-gray-400">
                                    Blood
                                </th>

                                <th className="px-5 py-3 text-left text-xs uppercase text-gray-400">
                                    Hospital
                                </th>

                                <th className="px-5 py-3 text-left text-xs uppercase text-gray-400">
                                    Urgency
                                </th>

                                <th className="px-5 py-3 text-left text-xs uppercase text-gray-400">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {data.recentRequests?.map(
                                (request) => (
                                    <tr
                                        key={request._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800">
                                                {request.patientName ||
                                                    "Unknown"}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {
                                                    request.patientProblem
                                                }
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="font-bold text-red-600">
                                                {
                                                    request.bloodGroup
                                                }
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {request.hospital ||
                                                "N/A"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    request.urgency ===
                                                    "urgent"
                                                        ? "bg-red-50 text-red-600"
                                                        : "bg-yellow-50 text-yellow-600"
                                                }`}
                                            >
                                                {request.urgency ||
                                                    "normal"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    request.status ===
                                                    "open"
                                                        ? "bg-red-50 text-red-600"
                                                        : request.status ===
                                                          "fulfilled"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {
                                                    request.status
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;