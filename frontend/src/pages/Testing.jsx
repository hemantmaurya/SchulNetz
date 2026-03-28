import { useState, useEffect } from "react";
import API from "../lib/api.js";

function Testing() {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    middleName: "",
    lastName: ""
  });

  const fetchRecords = async (page = 1) => {
    try {
      const res = await API.get(`/api/testing?page=${page}&limit=${limit}`);
      setRecords(res.data.data || []);
      setPagination(res.data.pagination || {});
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords(1);
  }, []);

  // Add Record
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/testing", formData);
      setShowAddModal(false);
      setFormData({ name: "", middleName: "", lastName: "" });
      fetchRecords(1);
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
      fetchRecords(currentPage);
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
      fetchRecords(currentPage);
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testing Records Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800"
        >
          + Add New Record
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow">
        <h2 className="text-xl font-semibold p-6 border-b">All Records</h2>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">ID</th>
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Middle Name</th>
                <th className="text-left py-3">Last Name</th>
                <th className="text-right py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">{record.id}</td>
                  <td className="py-4">{record.name}</td>
                  <td className="py-4">{record.middle_name}</td>
                  <td className="py-4">{record.last_name}</td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleEditClick(record)} className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button onClick={() => handleDeleteClick(record)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <p className="text-gray-600">
              Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, pagination.totalRecords || 0)} of {pagination.totalRecords || 0} records
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchRecords(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {pagination.totalPages || 1}
              </span>
              <button
                onClick={() => fetchRecords(currentPage + 1)}
                disabled={currentPage === (pagination.totalPages || 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Add New Record</h2>
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <input type="text" placeholder="First Name" className="w-full border p-4 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="Middle Name" className="w-full border p-4 rounded-2xl" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} />
              <input type="text" placeholder="Last Name" className="w-full border p-4 rounded-2xl" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Edit Record</h2>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <input type="text" placeholder="First Name" className="w-full border p-4 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="Middle Name" className="w-full border p-4 rounded-2xl" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} />
              <input type="text" placeholder="Last Name" className="w-full border p-4 rounded-2xl" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl">Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center">
            <h2 className="text-2xl font-semibold mb-2">Delete Record?</h2>
            <p className="text-gray-600 mb-8">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-4 bg-red-600 text-white rounded-2xl">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Testing;
