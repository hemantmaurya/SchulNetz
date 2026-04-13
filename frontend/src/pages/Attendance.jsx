
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
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Mark Attendance</h2>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
                {/* Course */}
                <div className="mb-6">
                    <label className="block font-medium mb-2">1. Select Course</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setSelectedSemester("");
                            setSelectedSubject("");
                        }}
                        className="w-full p-4 border-2 border-gray-300 rounded-2xl text-lg focus:border-black"
                    >
                        <option value="">-- Select Course --</option>
                        {courses.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Semester */}
                <div className="mb-6">
                    <label className="block font-medium mb-2">2. Select Semester</label>
                    <select
                        value={selectedSemester}
                        onChange={(e) => {
                            setSelectedSemester(e.target.value);
                            setSelectedSubject("");
                        }}
                        disabled={!selectedCourse}
                        className="w-full p-4 border-2 border-gray-300 rounded-2xl text-lg disabled:bg-gray-100"
                    >
                        <option value="">-- Select Semester --</option>
                        {semesterList.map((sem) => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                    </select>
                </div>

                {/* Subject */}
                <div className="mb-8">
                    <label className="block font-medium mb-2">3. Select Subject</label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        disabled={!selectedSemester}
                        className="w-full p-4 border-2 border-gray-300 rounded-2xl text-lg disabled:bg-gray-100"
                    >
                        <option value="">-- Select Subject --</option>
                        {currentSubjects.map((sub, i) => (
                            <option key={i} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleGo}
                        disabled={!selectedSubject}
                        className="py-5 bg-black text-white rounded-2xl text-xl font-bold hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        GO → Mark Attendance
                    </button>

                    <button
                        onClick={handleViewAttendance}
                        disabled={!selectedSubject}
                        className="py-5 bg-blue-600 text-white rounded-2xl text-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        📊 View Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Attendance;