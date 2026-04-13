import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../lib/api.js";
import { Save, Search, ArrowLeft } from "lucide-react";

function TakeAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [master, setMaster] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkStatus, setBulkStatus] = useState("present");
  const [loading, setLoading] = useState(false);

  const [attendanceData, setAttendanceData] = useState({});

  // Fetch Master + Students
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Attendance Master
        const masterRes = await API.get(`/api/attendance-master/${id}`);
        setMaster(masterRes.data.data);

        // Fetch Students
        const studentsRes = await API.get(`/api/students`);
        const studentList = studentsRes.data.data || [];

        setStudents(studentList);
        setFilteredStudents(studentList);

        // Default sab Present
        const initialData = {};
        studentList.forEach(student => {
          initialData[student.student_id] = { status: "present", remark: "" };
        });
        setAttendanceData(initialData);

      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Search
  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleBulkMark = () => {
    const updated = { ...attendanceData };
    filteredStudents.forEach(student => {
      updated[student.student_id] = { status: bulkStatus, remark: "" };
    });
    setAttendanceData(updated);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarkChange = (studentId, remark) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remark }
    }));
  };

  // Real Backend Save
  const handleSaveAttendance = async () => {
    try {
      const payload = Object.keys(attendanceData).map(studentId => ({
        attendance_id: parseInt(id),
        student_id: parseInt(studentId),
        status: attendanceData[studentId].status,     // "present", "absent", "leave"
        remark: attendanceData[studentId].remark || null
      }));

      const res = await API.post("/api/attendance-details/bulk", { 
        attendanceDetails: payload 
      });

      alert("✅ Attendance saved successfully!");
      navigate("/attendance-master");
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Loading Students...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate("/attendance-master")} className="flex items-center gap-2 text-gray-600 hover:text-black">
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-3xl font-semibold">Take Attendance</h1>
        <button
          onClick={handleSaveAttendance}
          className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-2xl flex items-center gap-2 font-medium"
        >
          <Save size={20} /> Save Attendance
        </button>
      </div>

      {/* Master Info */}
      {master && (
        <div className="bg-white rounded-3xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 shadow-sm">
          <div>
            <p className="text-gray-500 text-sm">Semester</p>
            <p className="font-semibold">4th Semester</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Subject</p>
            <p className="font-semibold">{master.topic || "Database Management System"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Date</p>
            <p className="font-semibold">{master.attendance_date}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Time</p>
            <p className="font-semibold">{master.start_time} - {master.end_time}</p>
          </div>
        </div>
      )}

      {/* Search & Bulk Action */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search student by name..."
            className="w-full pl-12 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="border rounded-2xl px-5 py-4"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
          <button
            onClick={handleBulkMark}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-medium"
          >
            Mark All
          </button>
        </div>
      </div>

      {/* Students Grid - 4 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStudents.map((student) => {
          const data = attendanceData[student.student_id] || { status: "present", remark: "" };
          return (
            <div key={student.student_id} className="bg-white border rounded-3xl p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-xl">{student.name}</h3>
                  <p className="text-gray-500 text-sm">ID: {student.student_id}</p>
                </div>
                <span className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                  data.status === "present" ? "bg-green-100 text-green-700" :
                  data.status === "absent" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {data.status.toUpperCase()}
                </span>
              </div>

              <select
                value={data.status}
                onChange={(e) => handleStatusChange(student.student_id, e.target.value)}
                className="w-full border rounded-2xl p-4 mb-4 focus:outline-none"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">On Leave</option>
              </select>

              <textarea
                placeholder="Add remark (optional)"
                value={data.remark}
                onChange={(e) => handleRemarkChange(student.student_id, e.target.value)}
                className="w-full border rounded-2xl p-4 h-24 resize-y"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TakeAttendance;