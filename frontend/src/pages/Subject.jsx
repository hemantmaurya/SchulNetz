import { useState, useEffect } from "react";
import API from "../lib/api.js";
import { Edit2, Trash2 } from "lucide-react";

function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);

  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
    description: "",
    credits: "",
    subject_type: "Theory",
  });

  const fetchSubjects = async (page = 1, newLimit = limit) => {
    try {
      const res = await API.get(`/api/subjects?page=${page}&limit=${newLimit}`);
      setSubjects(res.data.data || []);
      setPagination(
        res.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit: newLimit,
        }
      );
      setCurrentPage(page);
      setLimit(newLimit);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects(1, limit);
  }, []);

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

  const resetForm = () => {
    setFormData({
      subject_code: "",
      subject_name: "",
      description: "",
      credits: "",
      subject_type: "Theory",
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/subjects", {
        ...formData,
        credits: Number(formData.credits),
      });
      setShowAddModal(false);
      resetForm();
      fetchSubjects(1, limit);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add subject");
    }
  };

  const handleEditClick = (subject) => {
    setCurrentSubject(subject);
    setFormData({
      subject_code: subject.subject_code || "",
      subject_name: subject.subject_name || "",
      description: subject.description || "",
      credits: subject.credits || "",
      subject_type: subject.subject_type || "Theory",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/subjects/${currentSubject.subject_id}`, {
        ...formData,
        credits: Number(formData.credits),
      });
      setShowEditModal(false);
      resetForm();
      fetchSubjects(currentPage, limit);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update subject");
    }
  };

  const handleDeleteClick = (subject) => {
    setCurrentSubject(subject);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/subjects/${currentSubject.subject_id}`);
      setShowDeleteModal(false);
      fetchSubjects(currentPage, limit);
    } catch (err) {
      alert("Failed to delete subject");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold">Subjects</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-black text-white px-8 py-3 rounded-2xl">
          + Add Subject
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-4 text-left">Code</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Credits</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subject_id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{subject.subject_code}</td>
                  <td className="px-6 py-4">{subject.subject_name}</td>
                  <td className="px-6 py-4">{subject.credits}</td>
                  <td className="px-6 py-4">{subject.subject_type}</td>
                  <td className="px-6 py-4">{subject.description || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEditClick(subject)} className="mr-2"><Edit2 size={18} /></button>
                    <button onClick={() => handleDeleteClick(subject)}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-6">{showAddModal ? 'Add Subject' : 'Edit Subject'}</h2>
            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              <input className="w-full border p-3 rounded-xl" placeholder="Subject Code" value={formData.subject_code} onChange={(e) => setFormData({...formData, subject_code: e.target.value})} required />
              <input className="w-full border p-3 rounded-xl" placeholder="Subject Name" value={formData.subject_name} onChange={(e) => setFormData({...formData, subject_name: e.target.value})} required />
              <textarea className="w-full border p-3 rounded-xl" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <input type="number" className="w-full border p-3 rounded-xl" placeholder="Credits" value={formData.credits} onChange={(e) => setFormData({...formData, credits: e.target.value})} required />
              <select className="w-full border p-3 rounded-xl" value={formData.subject_type} onChange={(e) => setFormData({...formData, subject_type: e.target.value})}>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => {setShowAddModal(false); setShowEditModal(false);}} className="flex-1 border py-3 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 bg-black text-white py-3 rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Delete Subject?</h2>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 border py-3 rounded-xl">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 bg-red-600 text-white py-3 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subject;