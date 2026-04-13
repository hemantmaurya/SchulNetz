import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceMaster = () => {
    const navigate = useNavigate();

    const [lectures, setLectures] = useState([
        { id: 9, lectureNo: 4, date: "2026-04-07", startTime: "18:32", endTime: "19:32", topic: "intro", status: "active" },
        { id: 8, lectureNo: 5, date: "2026-03-31", startTime: "15:34", endTime: "16:34", topic: "", status: "active" },
        { id: 7, lectureNo: 9, date: "2026-04-08", startTime: "15:29", endTime: "16:29", topic: "", status: "active" },
        { id: 6, lectureNo: 6, date: "2026-04-05", startTime: "12:26", endTime: "13:26", topic: "", status: "active" },
        { id: 5, lectureNo: 3, date: "2026-04-08", startTime: "14:23", endTime: "15:23", topic: "", status: "active" },
        { id: 4, lectureNo: 2, date: "2026-04-01", startTime: "11:00", endTime: "12:00", topic: "Basics", status: "active" },
        { id: 3, lectureNo: 1, date: "2026-03-25", startTime: "10:30", endTime: "11:30", topic: "", status: "active" },
    ]);

    const [selectedLecture, setSelectedLecture] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter + Pagination Logic
    const filteredLectures = lectures.filter(lec =>
        lec.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lec.date.includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredLectures.length / itemsPerPage);
    const paginatedLectures = filteredLectures.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Students Data for View Section
    const studentsAttendance = [
        { id: 1, name: "Aarohi Sharma", roll: "CS001", status: "Present", remark: "Good participation" },
        { id: 2, name: "Rahul Verma", roll: "CS002", status: "Present", remark: "" },
        { id: 3, name: "Priya Singh", roll: "CS003", status: "Absent", remark: "Medical leave" },
        { id: 4, name: "Vikas Yadav", roll: "CS004", status: "Present", remark: "" },
        { id: 5, name: "Sneha Gupta", roll: "CS005", status: "Late", remark: "10 min late" },
        { id: 6, name: "Ankit Kumar", roll: "CS006", status: "Absent", remark: "" },
    ];

    const filteredStudents = studentsAttendance.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Button Handlers
    const handleTakeAttendance = (lecture) => {
        navigate(`/take-attendance?lectureId=${lecture.id}&semester=4&subject=${lecture.topic || 'intro'}`);
    };

    const handleEditLecture = (lecture) => {
        alert(`Edit Lecture ${lecture.lectureNo} - Edit form will open here`);
    };

    const handleDeleteLecture = (lecture) => {
        if (window.confirm(`Delete Lecture ${lecture.lectureNo}?`)) {
            setLectures(lectures.filter(l => l.id !== lecture.id));
        }
    };

    const handleViewClick = (lecture) => {
        setSelectedLecture(lecture);
        setSearchTerm("");        // Clear search when viewing
        setStatusFilter("All");
    };

    const getStatusColor = (status) => {
        if (status === "Present") return "bg-emerald-100 text-emerald-700 border border-emerald-200";
        if (status === "Absent") return "bg-red-100 text-red-700 border border-red-200";
        if (status === "Late") return "bg-amber-100 text-amber-700 border border-amber-200";
        return "bg-gray-100 text-gray-600";
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Attendance Master</h1>
                    <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all">
                        + New Lecture
                    </button>
                </div>

                {/* Lectures Table */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">All Lecture Sessions</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            Show <span className="font-medium text-black">{itemsPerPage}</span> per page
                        </div>
                    </div>

                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr className="text-left text-gray-600 border-b">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Lecture No</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Start Time</th>
                            <th className="px-6 py-4">End Time</th>
                            <th className="px-6 py-4">Topic</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedLectures.map((lec) => (
                            <tr key={lec.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-5">{lec.id}</td>
                                <td className="px-6 py-5 font-medium">{lec.lectureNo}</td>
                                <td className="px-6 py-5">{lec.date}</td>
                                <td className="px-6 py-5">{lec.startTime}</td>
                                <td className="px-6 py-5">{lec.endTime}</td>
                                <td className="px-6 py-5">{lec.topic || "—"}</td>
                                <td className="px-6 py-5">
                                    <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm">active</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-3">
                                        {/* View */}
                                        <button
                                            onClick={() => handleViewClick(lec)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm transition"
                                        >
                                            View
                                        </button>

                                        {/* Take */}
                                        <button
                                            onClick={() => handleTakeAttendance(lec)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm transition flex items-center gap-1"
                                        >
                                            Take
                                        </button>

                                        {/* Edit */}
                                        <button
                                            onClick={() => handleEditLecture(lec)}
                                            className="text-gray-500 hover:text-blue-600 transition p-2"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDeleteLecture(lec)}
                                            className="text-gray-500 hover:text-red-600 transition p-2"
                                            title="Delete"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLectures.length)} of {filteredLectures.length} entries
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ==================== VIEW ATTENDANCE SECTION ==================== */}
                {selectedLecture && (
                    <div className="mt-10 bg-white rounded-3xl shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold">Lecture {selectedLecture.lectureNo} Attendance</h2>
                                <p className="text-gray-600">{selectedLecture.date} • {selectedLecture.startTime} - {selectedLecture.endTime}</p>
                            </div>
                            <button
                                onClick={() => setSelectedLecture(null)}
                                className="text-3xl text-gray-400 hover:text-gray-900"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search student by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 py-4 border border-gray-300 rounded-2xl focus:border-blue-500"
                                />
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-6 py-4 border border-gray-300 rounded-2xl focus:border-blue-500"
                            >
                                <option value="All">All Students</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                            </select>
                        </div>

                        {/* Students Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map(student => (
                                <div key={student.id} className="bg-zinc-50 border border-gray-200 rounded-3xl p-6 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                                            <p className="text-gray-500 mt-1">Roll No: {student.roll}</p>
                                        </div>
                                        <span className={`px-5 py-2 text-sm font-medium rounded-2xl ${getStatusColor(student.status)}`}>
                                            {student.status}
                                        </span>
                                    </div>
                                    {student.remark && (
                                        <p className="mt-6 text-sm text-gray-600 bg-white p-3 rounded-2xl border">
                                            Remark: {student.remark}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceMaster;