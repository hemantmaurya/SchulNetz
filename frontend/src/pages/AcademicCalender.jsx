import { useState, useEffect } from "react";
import API from "../lib/api.js";

function AcademicCalendar() {
    const [records, setRecords] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

    const [formData, setFormData] = useState({
        eventName: "",
        startDate: "",
        endDate: "",
        description: ""
    });

    // FETCH WITH PAGINATION
    const fetchRecords = async (page = 1, newLimit = limit) => {
        try {
            const res = await API.get(`/api/academic-calendar?page=${page}&limit=${newLimit}`);
            setRecords(res.data.data || []);
            setPagination(res.data.pagination || { currentPage: page, totalPages: 1, totalRecords: 0, limit: newLimit });
            setCurrentPage(page);
            setLimit(newLimit);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRecords(1, limit);
    }, []);

    // Smart pagination numbers
    const getPageNumbers = () => {
        const total = pagination.totalPages;
        const current = currentPage;
        const pages = [];

        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);

            if (current > 4) pages.push("...");

            const start = Math.max(2, current - 2);
            const end = Math.min(total - 1, current + 2);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (current < total - 3) pages.push("...");
            if (!pages.includes(total)) pages.push(total);
        }
        return pages;
    };

    // ADD
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        await API.post("/api/academic-calendar", formData);
        setShowAddModal(false);
        setFormData({ eventName: "", startDate: "", endDate: "", description: "" });
        fetchRecords(1, limit);
    };

    // EDIT
    const handleEditClick = (r) => {
        setCurrentRecord(r);
        setFormData({
            eventName: r.event_name,
            startDate: r.start_date.split("T")[0],
            endDate: r.end_date.split("T")[0],
            description: r.description || ""
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await API.put(`/api/academic-calendar/${currentRecord.id}`, formData);
        setShowEditModal(false);
        fetchRecords(currentPage, limit);
    };

    // DELETE
    const handleDeleteClick = (r) => {
        setCurrentRecord(r);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        await API.delete(`/api/academic-calendar/${currentRecord.id}`);
        setShowDeleteModal(false);
        fetchRecords(currentPage, limit);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        fetchRecords(1, newLimit);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Academic Calendar</h1>
                <button
                    className="bg-black text-white px-4 py-2 rounded"
                    onClick={() => setShowAddModal(true)}
                >
                    + Add Event
                </button>
            </div>

            {/* Limit Select */}
            <div className="flex justify-end mb-2">
                <span className="mr-2">Show:</span>
                <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="border rounded px-2"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span className="ml-2">per page</span>
            </div>

            {/* TABLE */}
            <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Event</th>
                    <th className="p-2">Start</th>
                    <th className="p-2">End</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {records.map((r) => (
                    <tr key={r.id} className="text-center border-t">
                        <td className="p-2">{r.id}</td>
                        <td className="p-2">{r.event_name}</td>
                        <td className="p-2">{r.start_date.split("T")[0]}</td>
                        <td className="p-2">{r.end_date.split("T")[0]}</td>
                        <td className="p-2">{r.description}</td>
                        <td className="p-2 space-x-2">
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={() => handleEditClick(r)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => handleDeleteClick(r)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => fetchRecords(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <div className="flex gap-1">
                        {getPageNumbers().map((page, idx) =>
                            page === "..." ? (
                                <span key={idx} className="px-2">…</span>
                            ) : (
                                <button
                                    key={idx}
                                    onClick={() => fetchRecords(page)}
                                    className={`px-3 py-1 border rounded ${currentPage === page ? "bg-black text-white" : ""}`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => fetchRecords(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* MODALS */}
            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="mb-2">Add Event</h2>
                        <form onSubmit={handleAddSubmit}>
                            <input placeholder="Event Name" className="border w-full mb-2 p-2"
                                   value={formData.eventName}
                                   onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                            />
                            <input type="date" className="border w-full mb-2 p-2"
                                   value={formData.startDate}
                                   onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                            <input type="date" className="border w-full mb-2 p-2"
                                   value={formData.endDate}
                                   onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                            <input placeholder="Description" className="border w-full mb-2 p-2"
                                   value={formData.description}
                                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="flex gap-2 mt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 border py-2 rounded">Cancel</button>
                                <button type="submit" className="flex-1 bg-green-500 text-white py-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="mb-2">Edit Event</h2>
                        <form onSubmit={handleEditSubmit}>
                            <input className="border w-full mb-2 p-2"
                                   value={formData.eventName}
                                   onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                            />
                            <input type="date" className="border w-full mb-2 p-2"
                                   value={formData.startDate}
                                   onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                            <input type="date" className="border w-full mb-2 p-2"
                                   value={formData.endDate}
                                   onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                            <input className="border w-full mb-2 p-2"
                                   value={formData.description}
                                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="flex gap-2 mt-2">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 border py-2 rounded">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded text-center">
                        <p>Are you sure?</p>
                        <div className="flex gap-2 mt-2 justify-center">
                            <button className="border py-2 px-4 rounded" onClick={() => setShowDeleteModal(false)}>No</button>
                            <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleDeleteConfirm}>Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AcademicCalendar;