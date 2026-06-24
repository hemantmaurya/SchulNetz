import { useState, useEffect } from "react";
import API from "../../lib/api.js";
import { Edit2, Trash2, X } from "lucide-react";

function Student() {
    const [records, setRecords] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
    const [limit, setLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

    const [formData, setFormData] = useState({ name: "", course_id: "", branch_id: "" });

    // Fetch Students
    const fetchRecords = async (page = 1, newLimit = limit) => {
        try {
            const res = await API.get(`/api/students?page=${page}&limit=${newLimit}`);
            setRecords(res.data.data || []);
            setPagination(res.data.pagination || {});
            setCurrentPage(page);
            setLimit(newLimit);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        fetchRecords(1, newLimit);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => setFormData({ name: "", course_id: "", branch_id: "" });

    // Add Student
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/api/students", formData);
            setShowAddModal(false);
            resetForm();
            fetchRecords(1, limit);
        } catch (err) {
            console.error(err);
        }
    };

    // Edit
    const handleEditClick = (record) => {
        setCurrentRecord(record);
        setFormData({ name: record.name, course_id: record.course_id, branch_id: record.branch_id });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/api/students/${currentRecord.student_id}`, formData);
            setShowEditModal(false);
            resetForm();
            fetchRecords(currentPage, limit);
        } catch (err) {
            console.error(err);
        }
    };

    // Direct Delete (No confirmation)
    const handleDeleteClick = async (record) => {
        if (!window.confirm(`Delete ${record.name}?`)) return;   // ← Yeh chhota browser confirm hai (agar bilkul nahi chahiye to isko bhi hata sakte hain)

        try {
            await API.delete(`/api/students/${record.student_id}`);
            fetchRecords(currentPage, limit);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-semibold text-gray-900">Students</h1>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="bg-black text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800"
                >
                    + Add Student
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow border overflow-hidden">
                <div className="px-8 py-5 flex justify-between bg-gray-50 border-b">
                    <h2 className="text-lg font-semibold">All Students</h2>
                    <select value={limit} onChange={(e) => handleLimitChange(Number(e.target.value))} className="border px-4 py-2 rounded-xl">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead>
                        <tr>
                            <th className="px-8 py-4 text-left">ID</th>
                            <th className="px-8 py-4 text-left">Name</th>
                            <th className="px-8 py-4 text-left">Course ID</th>
                            <th className="px-8 py-4 text-left">Branch ID</th>
                            <th className="px-8 py-4 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {records.map((record) => (
                            <tr key={record.student_id} className="hover:bg-gray-50">
                                <td className="px-8 py-5">{record.student_id}</td>
                                <td className="px-8 py-5 font-medium">{record.name}</td>
                                <td className="px-8 py-5">{record.course_id}</td>
                                <td className="px-8 py-5">{record.branch_id}</td>
                                <td className="px-8 py-5 text-center">
                                    <div className="flex gap-4 justify-center">
                                        <button onClick={() => handleEditClick(record)} className="text-blue-600 hover:text-blue-800">
                                            <Edit2 size={20} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(record)} className="text-red-600 hover:text-red-800">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Simple Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-8 py-4 flex justify-between border-t">
                        <button onClick={() => fetchRecords(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-xl disabled:opacity-50">
                            Previous
                        </button>
                        <button onClick={() => fetchRecords(currentPage + 1)} disabled={currentPage === pagination.totalPages} className="px-4 py-2 border rounded-xl disabled:opacity-50">
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Add Modal (short) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Add Student</h2>
                            <button onClick={() => setShowAddModal(false)}><X size={28} /></button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="w-full border rounded-2xl px-4 py-3" required />
                            <input type="text" name="course_id" placeholder="Course ID" value={formData.course_id} onChange={handleInputChange} className="w-full border rounded-2xl px-4 py-3" required />
                            <input type="text" name="branch_id" placeholder="Branch ID" value={formData.branch_id} onChange={handleInputChange} className="w-full border rounded-2xl px-4 py-3" required />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border rounded-2xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-2xl">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal (short) */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Edit Student</h2>
                            <button onClick={() => setShowEditModal(false)}><X size={28} /></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded-2xl px-4 py-3" required />
                            <input type="text" name="course_id" value={formData.course_id} onChange={handleInputChange} className="w-full border rounded-2xl px-4 py-3" required />
                            <input type="text" name="branch_id" value={formData.branch_id} onChange={handleInputChange} className="w-full border rounded-2xl px-4 py-3" required />
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 border rounded-2xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-2xl">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Student;