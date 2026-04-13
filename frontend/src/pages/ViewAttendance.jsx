import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

function ViewAttendance() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const semester = searchParams.get("semester") || "4";
    const subject = searchParams.get("subject") || "Database Management System";

    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dummy Data (Real API integrate karne ke baad hata denge)
    const dummyData = [
        { date: "2026-04-09", time: "09:30 - 10:30", studentName: "Anu Sharma", studentId: "101", status: "present", remark: "Attended full lecture" },
        { date: "2026-04-09", time: "09:30 - 10:30", studentName: "Rahul Verma", studentId: "102", status: "absent", remark: "" },
        { date: "2026-04-09", time: "09:30 - 10:30", studentName: "Priya Singh", studentId: "103", status: "present", remark: "" },
        { date: "2026-04-08", time: "13:00 - 14:00", studentName: "Anu Sharma", studentId: "101", status: "present", remark: "" },
        { date: "2026-04-08", time: "13:00 - 14:00", studentName: "Rahul Verma", studentId: "102", status: "leave", remark: "Medical leave" },
        { date: "2026-04-07", time: "09:30 - 10:30", studentName: "Priya Singh", studentId: "103", status: "present", remark: "" },
        { date: "2026-04-07", time: "09:30 - 10:30", studentName: "Aarav Kumar", studentId: "104", status: "absent", remark: "Not informed" },
    ];

    useEffect(() => {
        setLoading(true);
        // Dummy data load (baad mein real API se replace kar denge)
        setTimeout(() => {
            setAttendanceData(dummyData);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate("/attendance")}
                className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition"
            >
                <ArrowLeft size={20} /> Back to Mark Attendance
            </button>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Attendance History</h1>
                    <p className="text-gray-600 mt-2 flex items-center gap-2">
                        <Calendar size={18} />
                        Semester {semester} • {subject}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-xl">Loading Attendance Records...</div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="py-5 px-6 text-left font-medium text-gray-600">Date</th>
                                <th className="py-5 px-6 text-left font-medium text-gray-600">Time</th>
                                <th className="py-5 px-6 text-left font-medium text-gray-600">Student Name</th>
                                <th className="py-5 px-6 text-left font-medium text-gray-600">Student ID</th>
                                <th className="py-5 px-6 text-left font-medium text-gray-600">Status</th>
                                <th className="py-5 px-6 text-left font-medium text-gray-600">Remark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {attendanceData.map((record, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                    <td className="py-5 px-6 font-medium">{record.date}</td>
                                    <td className="py-5 px-6 text-gray-600">{record.time}</td>
                                    <td className="py-5 px-6 font-medium text-gray-800">{record.studentName}</td>
                                    <td className="py-5 px-6 text-gray-600">{record.studentId}</td>
                                    <td className="py-5 px-6">
                                        <span className={`inline-block px-5 py-1.5 rounded-full text-sm font-medium ${
                                            record.status === 'present' ? 'bg-green-100 text-green-700' :
                                            record.status === 'absent' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {record.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-gray-600 italic">
                                        {record.remark || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {attendanceData.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-16 text-lg">
                    No attendance records found.
                </p>
            )}
        </div>
    );
}

export default ViewAttendance;