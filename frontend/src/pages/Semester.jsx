import { useState, useEffect } from "react";
import API from "../lib/api.js";
import { Edit2, Trash2 } from "lucide-react";

function Semester() {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [formData, setFormData] = useState({
    semester_number: "",
    semester_name: "",
    start_date: "",
    end_date: ""
  });

  // Fetch Semesters
  const fetchRecords = async (page = 1, newLimit = limit) => {
    try {
      const res = await API.get(`/api/semesters?page=${page}&limit=${newLimit}`);
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
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (current < total - 3) pages.push("...");
      if (!pages.includes(total)) pages.push(total);
    }
    return pages;
  };

  // Add Semester
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/semesters", formData);
      setShowAddModal(false);
      setFormData({ semester_number: "", semester_name: "", start_date: "", end_date: "" });
      fetchRecords(1, limit);
    } catch (err) {
      alert("Failed to add semester");
    }
  };

  // Edit Semester
  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setFormData({
      semester_number: record.semester_number,
      semester_name: record.semester_name,
      start_date: record.start_date.split('T')[0],   // format for date input
      end_date: record.end_date.split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/semesters/${currentRecord.semester_id}`, formData);
      setShowEditModal(false);
      fetchRecords(currentPage, limit);
    } catch (err) {
      alert("Failed to update semester");
    }
  };

  // Delete Semester
  const handleDeleteClick = (record) => {
    setCurrentRecord(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/semesters/${currentRecord.semester_id}`);
      setShowDeleteModal(false);
      fetchRecords(currentPage, limit);
    } catch (err) {
      alert("Failed to delete semester");
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    fetchRecords(1, newLimit);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Semesters</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-medium transition-all"
        >
          + New Semester
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
          <h2 className="font-medium">All Semesters</h2>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Show</span>
            <select 
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-black"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-gray-500">per page</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-5 px-8 font-medium text-gray-500">Semester ID</th>
                <th className="text-left py-5 px-8 font-medium text-gray-500">Semester No.</th>
                <th className="text-left py-5 px-8 font-medium text-gray-500">Semester Name</th>
                <th className="text-left py-5 px-8 font-medium text-gray-500">Start Date</th>
                <th className="text-left py-5 px-8 font-medium text-gray-500">End Date</th>
                <th className="text-right py-5 px-8 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map(record => (
                <tr key={record.semester_id} className="hover:bg-gray-50">
                  <td className="py-5 px-8">{record.semester_id}</td>
                  <td className="py-5 px-8 font-medium">{record.semester_number}</td>
                  <td className="py-5 px-8 font-medium">{record.semester_name}</td>
                  <td className="py-5 px-8 text-gray-600">{new Date(record.start_date).toLocaleDateString('en-IN')}</td>
                  <td className="py-5 px-8 text-gray-600">{new Date(record.end_date).toLocaleDateString('en-IN')}</td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEditClick(record)}
                        className="p-3 text-gray-500 hover:text-black hover:bg-gray-100 rounded-2xl transition-all"
                        title="Edit"
                      >
                        <Edit2 size={19} strokeWidth={2.5} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(record)}
                        className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={19} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-8 py-6 border-t flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * limit + 1}–{Math.min(currentPage * limit, pagination.totalRecords)} of {pagination.totalRecords} records
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchRecords(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2.5 text-sm border rounded-2xl disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>

              {getPageNumbers().map((page, index) => (
                page === "..." ? (
                  <span key={index} className="px-3 py-2 text-gray-400">…</span>
                ) : (
                  <button
                    key={index}
                    onClick={() => fetchRecords(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-2xl text-sm font-medium transition ${
                      currentPage === page 
                        ? "bg-black text-white" 
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => fetchRecords(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-5 py-2.5 text-sm border rounded-2xl disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-8">Add New Semester</h2>
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <input type="number" placeholder="Semester Number *" className="w-full border p-4 rounded-2xl" value={formData.semester_number} onChange={e => setFormData({...formData, semester_number: e.target.value})} required />
              <input type="text" placeholder="Semester Name *" className="w-full border p-4 rounded-2xl" value={formData.semester_name} onChange={e => setFormData({...formData, semester_name: e.target.value})} required />
              <input type="date" placeholder="Start Date *" className="w-full border p-4 rounded-2xl" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
              <input type="date" placeholder="End Date *" className="w-full border p-4 rounded-2xl" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl">Save Semester</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-8">Edit Semester</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <input type="number" placeholder="Semester Number *" className="w-full border p-4 rounded-2xl" value={formData.semester_number} onChange={e => setFormData({...formData, semester_number: e.target.value})} required />
              <input type="text" placeholder="Semester Name *" className="w-full border p-4 rounded-2xl" value={formData.semester_name} onChange={e => setFormData({...formData, semester_name: e.target.value})} required />
              <input type="date" placeholder="Start Date *" className="w-full border p-4 rounded-2xl" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
              <input type="date" placeholder="End Date *" className="w-full border p-4 rounded-2xl" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl">Update Semester</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-full max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-3">Delete Semester?</h2>
            <p className="text-gray-500 mb-10">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-4 bg-red-600 text-white rounded-2xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Semester;