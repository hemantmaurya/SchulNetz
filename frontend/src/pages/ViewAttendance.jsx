import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ViewAttendance = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const semester = searchParams.get("semester") || "4";
    const subject = searchParams.get("subject") || "intro";

    // Dummy Data - Real mein API se aayega
    const lectureInfo = {
        semester: `${semester}th Semester`,
        subject: subject === "intro" ? "Introduction to Programming" : subject,
        date: "07 April 2026",
        time: "18:32 - 19:32",
    };

    const [students] = useState([
        { id: 1, name: "Aarohi Sharma", roll: "CS001", status: "Present", remark: "Good participation" },
        { id: 2, name: "Rahul Verma", roll: "CS002", status: "Present", remark: "" },
        { id: 3, name: "Priya Singh", roll: "CS003", status: "Absent", remark: "Medical leave" },
        { id: 4, name: "Vikas Yadav", roll: "CS004", status: "Present", remark: "" },
        { id: 5, name: "Sneha Gupta", roll: "CS005", status: "Late", remark: "Arrived 15 min late" },
        { id: 6, name: "Ankit Kumar", roll: "CS006", status: "Absent", remark: "" },
        { id: 7, name: "Neha Patel", roll: "CS007", status: "Present", remark: "" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === "All" || student.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [students, searchTerm, filterStatus]);

    const getStatusStyle = (status) => {
        if (status === "Present") return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (status === "Absent") return "bg-red-100 text-red-700 border-red-200";
        if (status === "Late") return "bg-amber-100 text-amber-700 border-amber-200";
        return "bg-gray-100 text-gray-600";
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Back Button & Title */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">View Attendance</h1>
                </div>

                {/* Lecture Info */}
                <div className="bg-white rounded-3xl shadow p-6 mb-8 border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 text-sm">
                        <div>
                            <p className="text-gray-500">Semester</p>
                            <p className="font-semibold text-lg">{lectureInfo.semester}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Subject</p>
                            <p className="font-semibold text-lg">{lectureInfo.subject}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-semibold text-lg">{lectureInfo.date}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Time</p>
                            <p className="font-semibold text-lg">{lectureInfo.time}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search student by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 py-4 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-base"
                        />
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-6 py-4 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                    >
                        <option value="All">All Students</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                    </select>
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div key={student.id} className="bg-white rounded-3xl p-6 shadow hover:shadow-xl transition-all border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                                        <p className="text-gray-500 mt-1">Roll No: {student.roll}</p>
                                    </div>
                                    <span className={`px-5 py-2 text-sm font-medium rounded-2xl border ${getStatusStyle(student.status)}`}>
                                        {student.status}
                                    </span>
                                </div>

                                {student.remark && (
                                    <div className="mt-6 pt-4 border-t text-sm text-gray-600">
                                        Remark: {student.remark}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 text-gray-500 text-lg">
                            No matching students found
                        </div>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="mt-10 bg-white rounded-3xl p-6 shadow flex flex-wrap gap-8 justify-center md:justify-between text-center md:text-left">
                    <div>
                        <span className="block text-3xl font-bold text-gray-900">{students.length}</span>
                        <span className="text-gray-500">Total Students</span>
                    </div>
                    <div>
                        <span className="block text-3xl font-bold text-emerald-600">
                            {students.filter(s => s.status === "Present").length}
                        </span>
                        <span className="text-gray-500">Present</span>
                    </div>
                    <div>
                        <span className="block text-3xl font-bold text-red-600">
                            {students.filter(s => s.status === "Absent").length}
                        </span>
                        <span className="text-gray-500">Absent</span>
                    </div>
                    <div>
                        <span className="block text-3xl font-bold text-amber-600">
                            {students.filter(s => s.status === "Late").length}
                        </span>
                        <span className="text-gray-500">Late</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAttendance;