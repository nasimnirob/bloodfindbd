import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminBloodRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    const fetchRequests = async () => {
        try {
            setLoading(true);

            const query = status
                ? `?status=${status}`
                : "";

            const res = await fetch(
                `${API_URL}/admin/blood-requests${query}`
            );

            const data = await res.json();

            setRequests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [status]);

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(
                `${API_URL}/blood-requests/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            if (res.ok) {
                setRequests((prev) =>
                    prev.map((request) =>
                        request._id === id
                            ? {
                                  ...request,
                                  status: newStatus,
                              }
                            : request
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteRequest = async (id) => {
        const confirmDelete = window.confirm(
            "Delete this blood request?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `${API_URL}/admin/blood-requests/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (res.ok) {
                setRequests((prev) =>
                    prev.filter(
                        (request) =>
                            request._id !== id
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">

            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Blood Requests
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage all blood requests.
                </p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                {[
                    {
                        label: "All",
                        value: "",
                    },
                    {
                        label: "Open",
                        value: "open",
                    },
                    {
                        label: "Fulfilled",
                        value: "fulfilled",
                    },
                    {
                        label: "Cancelled",
                        value: "cancelled",
                    },
                ].map((item) => (
                    <button
                        key={item.value}
                        onClick={() =>
                            setStatus(item.value)
                        }
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                            status === item.value
                                ? "bg-red-600 text-white"
                                : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Patient
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Blood
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Location
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Hospital
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Contact
                                </th>

                                <th className="px-5 py-4 text-left text-xs uppercase text-gray-400">
                                    Status
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
                                        colSpan="7"
                                        className="px-5 py-10 text-center text-gray-400"
                                    >
                                        Loading requests...
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-5 py-10 text-center text-gray-400"
                                    >
                                        No requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map(
                                    (request) => (
                                        <tr
                                            key={
                                                request._id
                                            }
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-gray-800">
                                                    {
                                                        request.patientName
                                                    }
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    {
                                                        request.patientProblem
                                                    }
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-lg bg-red-50 px-3 py-1 font-bold text-red-600">
                                                    {
                                                        request.bloodGroup
                                                    }
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    request.district
                                                }

                                                <br />

                                                <span className="text-xs text-gray-400">
                                                    {
                                                        request.area
                                                    }
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    request.hospital
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    request.contactPhone
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                <select
                                                    value={
                                                        request.status
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateStatus(
                                                            request._id,
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    className={`rounded-lg border-0 px-3 py-2 text-xs font-semibold outline-none ${
                                                        request.status ===
                                                        "open"
                                                            ? "bg-red-50 text-red-600"
                                                            : request.status ===
                                                              "fulfilled"
                                                            ? "bg-green-50 text-green-600"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    <option value="open">
                                                        Open
                                                    </option>

                                                    <option value="fulfilled">
                                                        Fulfilled
                                                    </option>

                                                    <option value="cancelled">
                                                        Cancelled
                                                    </option>
                                                </select>
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() =>
                                                        deleteRequest(
                                                            request._id
                                                        )
                                                    }
                                                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBloodRequests;