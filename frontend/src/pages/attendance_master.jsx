import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../lib/api.js";
import { Edit2, Trash2, Plus, ClipboardList } from "lucide-react";

function AttendanceMaster() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL se selected values le rahe hain
  const semester = searchParams.get("semester") || "4";
  const subject = searchParams.get("subject") || "Database Management System";

  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    faculty_subject_id: 5,
    lecture_no: "",
    attendance_date: today,
    start_time: "09:30",
    end_time: "10:30",
    topic: "",
    comment: "",
    status: "active"
  });

  const fetchRecords = async (page = 1, newLimit = limit) => {
    try {
      const res = await API.get(`/api/attendance-master?page=${page}&limit=${newLimit}`);
      setRecords(res.data.data || []);
      setPagination(res.data.pagination || { currentPage: page, totalPages: 1, totalRecords: 0, limit: newLimit });
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleTakeAttendance = (record) => {
    navigate(`/take-attendance/${record.id}`);
  };

  // ==================== ADD ====================
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/attendance-master", formData);
      setShowAddModal(false);
      setFormData({ ...formData, lecture_no: "", topic: "", comment: "", attendance_date: today });
      fetchRecords();
      alert("✅ New Lecture Created!");
    } catch (err) {
      alert("Failed to create lecture");
    }
  };

  // ==================== EDIT ====================
  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setFormData({
      faculty_subject_id: record.faculty_subject_id,
      lecture_no: record.lecture_no,
      attendance_date: record.attendance_date,
      start_time: record.start_time,
      end_time: record.end_time,
      topic: record.topic || "",
      comment: record.comment || "",
      status: record.status
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/attendance-master/${currentRecord.id}`, formData);
      setShowEditModal(false);
      fetchRecords();
      alert("✅ Lecture Updated!");
    } catch (err) {
      alert("Failed to update");
    }
  };

  // ==================== DELETE ====================
  const handleDeleteClick = (record) => {
    setCurrentRecord(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/attendance-master/${currentRecord.id}`);
      setShowDeleteModal(false);
      fetchRecords();
      alert("✅ Lecture Deleted!");
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-semibold">Attendance Master</h1>
          <div className="flex gap-4 mt-3">
            <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-2xl text-sm font-medium">
              Semester {semester}
            </div>
            <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-2xl text-sm font-medium">
              {subject}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-medium"
        >
          <Plus size={20} /> New Lecture
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="px-8 py-5 border-b flex justify-between bg-gray-50">
          <h2 className="font-medium text-lg">All Lecture Sessions</h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">Show</span>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border rounded-xl px-4 py-2">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-5 px-6 text-left">ID</th>
                <th className="py-5 px-6 text-left">Lecture No</th>
                <th className="py-5 px-6 text-left">Date</th>
                <th className="py-5 px-6 text-left">Start</th>
                <th className="py-5 px-6 text-left">End</th>
                <th className="py-5 px-6 text-left">Topic</th>
                <th className="py-5 px-6 text-left">Status</th>
                <th className="py-5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="py-5 px-6">{record.id}</td>
                  <td className="py-5 px-6 font-medium">{record.lecture_no}</td>
                  <td className="py-5 px-6">{record.attendance_date}</td>
                  <td className="py-5 px-6">{record.start_time}</td>
                  <td className="py-5 px-6">{record.end_time}</td>
                  <td className="py-5 px-6 max-w-xs truncate">{record.topic || "—"}</td>
                  <td className="py-5 px-6">
                    <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm">active</span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleTakeAttendance(record)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 text-sm">
                        <ClipboardList size={18} /> Take
                      </button>
                      <button onClick={() => handleEditClick(record)} className="p-3 hover:bg-gray-100 rounded-xl">
                        <Edit2 size={20} />
                      </button>
                      <button onClick={() => handleDeleteClick(record)} className="p-3 hover:bg-red-50 text-red-500 rounded-xl">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-6">New Lecture Session</h2>
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Lecture No *" className="border p-4 rounded-2xl" value={formData.lecture_no} onChange={e => setFormData({...formData, lecture_no: e.target.value})} required />
                <input type="date" className="border p-4 rounded-2xl" value={formData.attendance_date} onChange={e => setFormData({...formData, attendance_date: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="time" className="border p-4 rounded-2xl" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} required />
                <input type="time" className="border p-4 rounded-2xl" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} required />
              </div>
              <input type="text" placeholder="Topic *" className="w-full border p-4 rounded-2xl" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} required />
              <textarea placeholder="Comment (optional)" className="w-full border p-4 rounded-2xl h-24" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} />

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 border rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl">Create Lecture</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit aur Delete Modal bhi chahiye toh batao, main add kar dunga */}

    </div>
  );
}

export default AttendanceMaster;