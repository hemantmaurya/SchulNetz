import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
    const navigate = useNavigate();

    const courses = [
        { id: "1", name: "BBA", semesters: 6 },
        { id: "2", name: "B.Tech Computer Science", semesters: 8 },
        { id: "3", name: "BCA", semesters: 6 },
        { id: "4", name: "B.Tech Mechanical", semesters: 8 },
    ];

    const allSubjects = {
        "1": ["Principles of Management", "Financial Accounting", "Marketing", "Business Law"],
        "2": ["Mathematics-I", "Physics", "Programming Fundamentals", "Data Structures", "AI"],
        "3": ["C Programming", "Web Development", "Java", "Python", "Software Engineering"],
        "4": ["Thermodynamics", "Fluid Mechanics", "CAD/CAM", "Robotics"],
    };

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const currentSubjects = selectedCourse ? allSubjects[selectedCourse] || [] : [];
    const semesterList = selectedCourse
        ? Array.from({ length: courses.find(c => c.id === selectedCourse)?.semesters || 0 }, (_, i) => i + 1)
        : [];

    const handleGo = () => {
        if (!selectedCourse || !selectedSemester || !selectedSubject) {
            alert("Please select all fields!");
            return;
        }
        navigate(`/attendance-master?course=${selectedCourse}&semester=${selectedSemester}&subject=${selectedSubject}`);
    };

    const handleViewAttendance = () => {
        if (!selectedCourse || !selectedSemester || !selectedSubject) {
            alert("Please select all fields to view attendance!");
            return;
        }
        navigate(`/view-attendance?course=${selectedCourse}&semester=${selectedSemester}&subject=${selectedSubject}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 bg-white shadow-lg px-8 py-4 rounded-3xl mb-4 border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-4xl">
                            📅
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
                            <p className="text-gray-600 text-sm mt-1">Select course, semester & subject</p>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    <div className="space-y-8">
                        {/* Course Selection */}
                        <div>
                            <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                                <div className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-xl text-sm font-bold shadow-sm">1</div>
                                Select Course
                            </label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => {
                                    setSelectedCourse(e.target.value);
                                    setSelectedSemester("");
                                    setSelectedSubject("");
                                }}
                                className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white shadow-sm"
                            >
                                <option value="">-- Choose Course --</option>
                                {courses.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Semester Selection */}
                        <div>
                            <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                                <div className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-xl text-sm font-bold shadow-sm">2</div>
                                Select Semester
                            </label>
                            <select
                                value={selectedSemester}
                                onChange={(e) => {
                                    setSelectedSemester(e.target.value);
                                    setSelectedSubject("");
                                }}
                                disabled={!selectedCourse}
                                className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
                            >
                                <option value="">-- Choose Semester --</option>
                                {semesterList.map((sem) => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Selection */}
                        <div>
                            <label className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-3">
                                <div className="bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-xl text-sm font-bold shadow-sm">3</div>
                                Select Subject
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                disabled={!selectedSemester}
                                className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
                            >
                                <option value="">-- Choose Subject --</option>
                                {currentSubjects.map((sub, i) => (
                                    <option key={i} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 mt-10">
                        <button
                            onClick={handleGo}
                            disabled={!selectedSubject}
                            className="py-4 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white font-semibold text-lg rounded-2xl transition-all active:scale-[0.97] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                        >
                            GO → Mark
                        </button>

                        <button
                            onClick={handleViewAttendance}
                            disabled={!selectedSubject}
                            className="py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-2xl transition-all active:scale-[0.97] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>📊</span> View Attendance
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-500 mt-8">
                    All fields are required to enable actions
                </p>
            </div>
        </div>
    );
};

export default Attendance;