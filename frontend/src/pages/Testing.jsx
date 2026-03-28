import { useState, useEffect } from "react";
import API from "../lib/api.js";

function Testing() {
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
    name: "",
    middleName: "",
    lastName: ""
  });

  const fetchRecords = async (page = 1, newLimit = limit) => {
    try {
      const res = await API.get(`/api/testing?page=${page}&limit=${newLimit}`);
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

  // Smart pagination numbers (1 2 3 ... 50 ... 100 ... 541 542 543)
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

  // Add Record
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/testing", formData);
      setShowAddModal(false);
      setFormData({ name: "", middleName: "", lastName: "" });
      fetchRecords(1, limit);
    } catch (err) {
      alert("Failed to add record");
    }
  };

  // Edit Record
  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setFormData({
      name: record.name || "",
      middleName: record.middle_name || "",
      lastName: record.last_name || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/testing/${currentRecord.id}`, formData);
      setShowEditModal(false);
      fetchRecords(currentPage, limit);
    } catch (err) {
      alert("Failed to update record");
    }
  };

  // Delete Record
  const handleDeleteClick = (record) => {
    setCurrentRecord(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/testing/${currentRecord.id}`);
      setShowDeleteModal(false);
      fetchRecords(currentPage, limit);
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    fetchRecords(1, newLimit);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Testing Records</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-medium transition-all"
        >
          + New Record
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
          <h2 className="font-medium">All Records</h2>
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
                <th className="text-left py-5 px-8 font-medium text-gray-500">ID</th>
                <th className="text-left py-5 px-8 font-medium text-gray-500">Name</th>
                <th className="text-left py-5 px-8 font-medium text-gray-500">Middle Name</th>
                <th className="text-left py-5 px-8 font-medium text-gray-500">Last Name</th>
                <th className="text-right py-5 px-8 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="py-5 px-8">{record.id}</td>
                  <td className="py-5 px-8 font-medium">{record.name}</td>
                  <td className="py-5 px-8 text-gray-600">{record.middle_name || "—"}</td>
                  <td className="py-5 px-8 text-gray-600">{record.last_name}</td>
                  <td className="py-5 px-8 text-right space-x-6">
                    <button onClick={() => handleEditClick(record)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteClick(record)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Smart Pagination */}
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
            <h2 className="text-2xl font-semibold mb-8">Add New Record</h2>
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <input type="text" placeholder="First Name *" className="w-full border p-4 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="Middle Name" className="w-full border p-4 rounded-2xl" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} />
              <input type="text" placeholder="Last Name *" className="w-full border p-4 rounded-2xl" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-8">Edit Record</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <input type="text" placeholder="First Name *" className="w-full border p-4 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="Middle Name" className="w-full border p-4 rounded-2xl" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} />
              <input type="text" placeholder="Last Name *" className="w-full border p-4 rounded-2xl" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-full max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-3">Delete Record?</h2>
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

export default Testing;
