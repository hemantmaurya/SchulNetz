#!/bin/bash

echo "🚀 Smart Laravel-style Page Generator"
echo "===================================="

read -p "Enter Page Name (e.g. CoursesPage): " PAGE_NAME

if [ -z "$PAGE_NAME" ]; then
  echo "❌ Page name is required!"
  exit 1
fi

# Extract table name (CoursesPage → courses)
TABLE_NAME=$(echo "$PAGE_NAME" | sed 's/Page$//' | tr '[:upper:]' '[:lower:]')

echo "🔍 Searching for controller for table '$TABLE_NAME'..."

CONTROLLER_FILE="src/controllers/${TABLE_NAME^}Controller.js"

if [ ! -f "frontend/src/controllers/${TABLE_NAME^}Controller.js" ] && [ ! -f "/app/src/controllers/${TABLE_NAME^}Controller.js" ]; then
  echo "❌ Controller not found: ${TABLE_NAME^}Controller.js"
  echo "Please create the controller first using make-controller.sh"
  exit 1
fi

echo "✅ Found controller for table: $TABLE_NAME"

read -p "Do you want Pagination in the table? (y/N): " want_pagination
want_pagination=$(echo "$want_pagination" | tr '[:upper:]' '[:lower:]')

echo "Generating page: $PAGE_NAME ..."

docker compose exec frontend sh -c '
cat > /app/src/pages/'${PAGE_NAME}'.jsx << "PAGE"
import { useState, useEffect } from "react";
import API from "../lib/api.js";
import { Edit2, Trash2, Plus } from "lucide-react";

function '${PAGE_NAME}'() {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    course_name: "",
    description: ""
  });

  const fetchRecords = async (page = 1, newLimit = limit) => {
    try {
      const res = await API.get(`/api/'${TABLE_NAME}'?page=${page}&limit=${newLimit}`);
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

  // Add Record
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/'${TABLE_NAME}'", formData);
      setShowAddModal(false);
      setFormData({ name: "", course_name: "", description: "" });
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
      course_name: record.course_name || "",
      description: record.description || ""
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/'${TABLE_NAME}'/${currentRecord.id}`, formData);
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
      await API.delete(`/api/'${TABLE_NAME}'/${currentRecord.id}`);
      setShowDeleteModal(false);
      fetchRecords(currentPage, limit);
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">'${PAGE_NAME}' Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium transition-all"
        >
          <Plus size={20} />
          New Record
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-5 px-8 font-semibold">ID</th>
              <th className="text-left py-5 px-8 font-semibold">Name</th>
              <th className="text-left py-5 px-8 font-semibold">Course Name</th>
              <th className="text-left py-5 px-8 font-semibold">Description</th>
              <th className="text-right py-5 px-8 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="py-5 px-8">{record.id}</td>
                <td className="py-5 px-8 font-medium">{record.name}</td>
                <td className="py-5 px-8">{record.course_name}</td>
                <td className="py-5 px-8 text-gray-600">{record.description || "—"}</td>
                <td className="py-5 px-8 text-right">
                  <button
                    onClick={() => handleEditClick(record)}
                    className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl mr-2"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(record)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Add New Record</h2>
            <form onSubmit={handleAddSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full border rounded-2xl px-5 py-4"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Course Name"
                className="w-full border rounded-2xl px-5 py-4"
                value={formData.course_name}
                onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full border rounded-2xl px-5 py-4 h-28"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 border rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-black text-white rounded-2xl"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Similar modals for Edit and Delete can be added if needed */}

    </div>
  );
}

export default '${PAGE_NAME}';
PAGE
'

echo "✅ Page created: src/pages/${PAGE_NAME}.jsx"
echo "Next step: docker compose restart frontend"
