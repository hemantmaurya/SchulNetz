import { useState, useEffect } from "react";
import API from "../lib/api.js";

function AcademicCalendar() {
    const [records, setRecords] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 12
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(12);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        eventName: "",
        startDate: "",
        endDate: "",
        description: ""
    });

    // Fetch Events
    const fetchRecords = async (page = 1, newLimit = limit) => {
        setLoading(true);
        setError("");
        try {
            const res = await API.get(`/api/academic-calendar?page=${page}&limit=${newLimit}`);
            setRecords(res.data.data || []);
            setPagination(res.data.pagination || { currentPage: page, totalPages: 1, totalRecords: 0, limit: newLimit });
            setCurrentPage(page);
            setLimit(newLimit);
        } catch (err) {
            console.error(err);
            setError("Failed to load academic events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords(1, limit);
    }, []);

    // Open Add Modal
    const openAddModal = () => {
        setFormData({ eventName: "", startDate: "", endDate: "", description: "" });
        setIsEditing(false);
        setCurrentRecord(null);
        setShowModal(true);
    };

    // Open Edit Modal
    const openEditModal = (record) => {
        setCurrentRecord(record);
        setFormData({
            eventName: record.event_name,
            startDate: record.start_date.split("T")[0],
            endDate: record.end_date.split("T")[0],
            description: record.description || ""
        });
        setIsEditing(true);
        setShowModal(true);
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (isEditing && currentRecord) {
                await API.put(`/api/academic-calendar/${currentRecord.id}`, formData);
            } else {
                await API.post("/api/academic-calendar", formData);
            }
            setShowModal(false);
            fetchRecords(currentPage, limit);
        } catch (err) {
            console.error(err);
            setError("Failed to save event. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Delete Event
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await API.delete(`/api/academic-calendar/${id}`);
            fetchRecords(currentPage, limit);
        } catch (err) {
            setError("Failed to delete event");
        }
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        fetchRecords(1, newLimit);
    };

    // Smart Pagination
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
            for (let i = start; i <= end; i++) if (!pages.includes(i)) pages.push(i);
            if (current < total - 3) pages.push("...");
            if (!pages.includes(total)) pages.push(total);
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Academic Calendar</h1>
                        <p className="text-gray-600 mt-1">Manage all important academic events and deadlines</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        <span className="text-xl">+</span> Add New Event
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Controls */}
                <div className="flex justify-end mb-6">
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm">
                        <span className="text-sm text-gray-600">Show</span>
                        <select
                            value={limit}
                            onChange={(e) => handleLimitChange(Number(e.target.value))}
                            className="bg-transparent border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                        >
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                            <option value={48}>48</option>
                        </select>
                        <span className="text-sm text-gray-600">per page</span>
                    </div>
                </div>

                {/* Events Grid - Modern Cards */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500 text-lg">Loading events...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {records.length === 0 ? (
                            <div className="col-span-full text-center py-16 text-gray-500">
                                No events added yet. Click "Add New Event" to get started.
                            </div>
                        ) : (
                            records.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                                >
                                    <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                                    <div className="p-6">
                                        <h3 className="font-semibold text-xl text-gray-900 leading-tight mb-3 line-clamp-2">
                                            {event.event_name}
                                        </h3>

                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                                                {new Date(event.start_date).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short'
                                                })}
                                            </div>
                                            <span className="text-gray-400">→</span>
                                            <div className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
                                                {new Date(event.end_date).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short'
                                                })}
                                            </div>
                                        </div>

                                        {event.description && (
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                                                {event.description}
                                            </p>
                                        )}

                                        <div className="flex gap-3 pt-4 border-t">
                                            <button
                                                onClick={() => openEditModal(event)}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-2xl font-medium transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-2xl font-medium transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-3xl shadow-sm">
                            <button
                                onClick={() => fetchRecords(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-5 py-2 rounded-2xl hover:bg-gray-100 disabled:opacity-40 transition"
                            >
                                ← Prev
                            </button>

                            {getPageNumbers().map((page, idx) => (
                                page === "..." ? (
                                    <span key={idx} className="px-4 py-2 text-gray-400">⋯</span>
                                ) : (
                                    <button
                                        key={idx}
                                        onClick={() => fetchRecords(page)}
                                        className={`w-10 h-10 rounded-2xl font-medium transition ${currentPage === page
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "hover:bg-gray-100 text-gray-700"}`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}

                            <button
                                onClick={() => fetchRecords(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                                className="px-5 py-2 rounded-2xl hover:bg-gray-100 disabled:opacity-40 transition"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modern Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
                        <div className="px-8 pt-8 pb-6">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {isEditing ? "Edit Event" : "Create New Event"}
                            </h2>
                            <p className="text-gray-500 mt-1">Fill the details below</p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.eventName}
                                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-500 text-lg"
                                    placeholder="e.g. Mid Semester Examination"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-5 py-4 border border-gray-300 rounded-3xl focus:outline-none focus:border-indigo-500 resize-y"
                                    placeholder="Add any additional information..."
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 border border-gray-300 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-semibold transition disabled:opacity-70"
                                >
                                    {submitLoading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AcademicCalendar;