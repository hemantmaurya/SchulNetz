import { useState, useEffect } from "react";
import API from "../lib/api.js";
import { Edit2, Trash2, Plus, Calendar, X, Eye } from "lucide-react";

function Exams() {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 });
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentExam, setCurrentExam] = useState(null);

    // For viewing subjects of an exam
    const [showSubjectsModal, setShowSubjectsModal] = useState(false);
    const [viewSubjects, setViewSubjects] = useState([]);

    const [formData, setFormData] = useState({
        course_id: "",
        semester_id: "",
        exam_name: "",
        academic_year: "",
        start_date: "",
        end_date: "",
        exam_type: "Theory",
        status: "Upcoming"
    });

    const [examSubjects, setExamSubjects] = useState([]);

    // Fetch all exams
    const fetchExams = async (page = 1, newLimit = limit) => {
        try {
            const res = await API.get(`/api/exams?page=${page}&limit=${newLimit}`);
            setExams(res.data.data || []);
            setPagination(res.data.pagination || { currentPage: page, totalPages: 1, totalRecords: 0, limit: newLimit });
            setCurrentPage(page);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await API.get("/api/courses?limit=100");
            setCourses(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchSemesters = async (course_id) => {
        if (!course_id) return setSemesters([]);
        try {
            const res = await API.get(`/api/semesters/course/${course_id}`);
            setSemesters(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchSubjectsBySemester = async (semester_id) => {
        if (!semester_id) return setSubjects([]);
        try {
            const res = await API.get(`/api/exam-subjects/semester/${semester_id}`);
            setSubjects(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch subjects of a specific exam
    const fetchExamSubjects = async (exam_id) => {
        try {
            const res = await API.get(`/api/exam-subjects/exam/${exam_id}`);
            console.log("API Response:", res.data);   // Debugging

            setViewSubjects(res.data.data || []);
            setShowSubjectsModal(true);
        } catch (err) {
            console.error("Fetch Subjects Error:", err.response?.data || err);
            alert("Failed to load subjects");
        }
    };

    useEffect(() => {
        fetchExams();
        fetchCourses();
    }, []);

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setFormData({ ...formData, course_id: courseId, semester_id: "" });
        setExamSubjects([]);
        setSubjects([]);
        fetchSemesters(courseId);
    };

    const handleSemesterChange = (e) => {
        const semId = e.target.value;
        setFormData({ ...formData, semester_id: semId });
        setExamSubjects([]);
        fetchSubjectsBySemester(semId);
    };

    const addSubjectRow = () => {
        setExamSubjects([...examSubjects, { subject_id: "", exam_date: "", exam_time: "", room_no: "" }]);
    };

    const updateSubjectRow = (index, field, value) => {
        const updated = [...examSubjects];
        updated[index][field] = value;
        setExamSubjects(updated);
    };

    const removeSubjectRow = (index) => {
        setExamSubjects(examSubjects.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setFormData({
            course_id: "", semester_id: "", exam_name: "", academic_year: "",
            start_date: "", end_date: "", exam_type: "Theory", status: "Upcoming"
        });
        setExamSubjects([]);
        setSubjects([]);
        setSemesters([]);
    };

    // Create Exam - New exam will show at the top
    const handleAddSubmit = async (e) => {
        e.preventDefault();

        if (!formData.course_id || !formData.semester_id || !formData.exam_name || !formData.academic_year) {
            alert("Please fill Course, Semester, Exam Name and Academic Year");
            return;
        }
        if (examSubjects.length === 0) {
            alert("Please add at least one subject");
            return;
        }

        try {
            const payload = {
                ...formData,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
            };

            const response = await API.post("/api/exams", payload);
            const newExam = response.data?.data || response.data;

            // Add new exam at the top
            setExams(prev => [newExam, ...prev]);

            setShowAddModal(false);
            resetForm();

            alert("Exam created successfully!");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to create exam");
        }
    };

    const handleDeleteClick = (exam) => {
        setCurrentExam(exam);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await API.delete(`/api/exams/${currentExam.id}`);
            setShowDeleteModal(false);
            fetchExams(currentPage, limit);
        } catch (err) {
            alert("Failed to delete exam");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-semibold tracking-tight flex items-center gap-3">
                    <Calendar size={36} className="text-black" />
                    Examinations
                </h1>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    className="bg-black hover:bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-medium flex items-center gap-2"
                >
                    <Plus size={20} /> New Exam
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
                    <h2 className="font-medium">All Examinations</h2>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">Show</span>
                        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="bg-white border border-gray-200 rounded-xl px-4 py-2">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span className="text-gray-500">per page</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left py-5 px-8 font-medium text-gray-600">Exam Name</th>
                            <th className="text-left py-5 px-8 font-medium text-gray-600">Course</th>
                            <th className="text-left py-5 px-8 font-medium text-gray-600">Semester</th>
                            <th className="text-left py-5 px-8 font-medium text-gray-600">Academic Year</th>
                            <th className="text-left py-5 px-8 font-medium text-gray-600">Exam Period</th>
                            <th className="text-left py-5 px-8 font-medium text-gray-600">Type</th>
                            <th className="text-left py-5 px-8 font-medium text-gray-600">Subjects</th>
                            <th className="text-right py-5 px-8 font-medium text-gray-600">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {exams.length === 0 ? (
                            <tr><td colSpan="8" className="py-20 text-center text-gray-400">No exams found</td></tr>
                        ) : (
                            exams.map((exam) => (
                                <tr key={exam.id} className="hover:bg-gray-50">
                                    <td className="py-6 px-8 font-semibold">{exam.exam_name}</td>
                                    <td className="py-6 px-8 text-gray-700">{exam.course_name || "—"}</td>
                                    <td className="py-6 px-8 text-gray-700">{exam.semester_name || "—"}</td>
                                    <td className="py-6 px-8">{exam.academic_year}</td>
                                    <td className="py-6 px-8 text-gray-600">
                                        {formatDate(exam.start_date)} — {formatDate(exam.end_date)}
                                    </td>
                                    <td className="py-6 px-8">
                                            <span className={`px-4 py-1.5 text-xs font-medium rounded-2xl ${
                                                exam.exam_type?.toLowerCase() === 'practical' ? 'bg-purple-100 text-purple-700' :
                                                    exam.exam_type?.toLowerCase() === 'viva' ? 'bg-pink-100 text-pink-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }`}>
                                                {exam.exam_type || "Theory"}
                                            </span>
                                    </td>
                                    <td className="py-6 px-8">
                                        <button
                                            onClick={() => fetchExamSubjects(exam.id)}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <Eye size={18} />
                                            View Subjects
                                        </button>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => alert("Edit coming soon...")} className="p-3.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-2xl">
                                                <Edit2 size={20} strokeWidth={2.8} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(exam)} className="p-3.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-2xl">
                                                <Trash2 size={20} strokeWidth={2.8} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==================== CREATE NEW EXAM MODAL ==================== */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
                        <div className="px-8 py-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Create New Exam</h2>
                            <button onClick={() => { setShowAddModal(false); resetForm(); }}>
                                <X size={26} />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="flex-1 overflow-auto p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Course</label>
                                    <select value={formData.course_id} onChange={handleCourseChange} required className="w-full border border-gray-300 rounded-2xl px-4 py-3">
                                        <option value="">Select Course</option>
                                        {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Semester</label>
                                    <select value={formData.semester_id} onChange={handleSemesterChange} required className="w-full border border-gray-300 rounded-2xl px-4 py-3">
                                        <option value="">Select Semester</option>
                                        {semesters.map(s => <option key={s.semester_id} value={s.semester_id}>{s.semester_name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Exam Name</label>
                                    <input type="text" value={formData.exam_name} onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })} required className="w-full border border-gray-300 rounded-2xl px-4 py-3" placeholder="Mid Term Examination" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Academic Year</label>
                                    <input type="text" value={formData.academic_year} onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })} required className="w-full border border-gray-300 rounded-2xl px-4 py-3" placeholder="2025-26" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Exam Type</label>
                                    <select value={formData.exam_type} onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })} className="w-full border border-gray-300 rounded-2xl px-4 py-3">
                                        <option value="Theory">Theory</option>
                                        <option value="Practical">Practical</option>
                                        <option value="Viva">Viva</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date (Optional)</label>
                                    <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full border border-gray-300 rounded-2xl px-4 py-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                                    <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="w-full border border-gray-300 rounded-2xl px-4 py-3" />
                                </div>
                            </div>

                            {/* Subject-wise Schedule */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-lg font-medium">Subject-wise Schedule</label>
                                    <button type="button" onClick={addSubjectRow} className="text-black underline text-sm">+ Add Subject</button>
                                </div>

                                <div className="space-y-4">
                                    {examSubjects.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-4 p-5 border rounded-2xl bg-gray-50 items-end">
                                            <div className="col-span-5">
                                                <select value={item.subject_id} onChange={(e) => updateSubjectRow(index, 'subject_id', e.target.value)} required className="w-full border rounded-xl px-4 py-3">
                                                    <option value="">Select Subject</option>
                                                    {subjects.map(s => (
                                                        <option key={s.subject_id} value={s.subject_id}>
                                                            {s.subject_name} ({s.subject_code})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-3">
                                                <input type="date" value={item.exam_date} onChange={(e) => updateSubjectRow(index, 'exam_date', e.target.value)} required className="w-full border rounded-xl px-4 py-3" />
                                            </div>
                                            <div className="col-span-3">
                                                <input type="time" value={item.exam_time} onChange={(e) => updateSubjectRow(index, 'exam_time', e.target.value)} className="w-full border rounded-xl px-4 py-3" />
                                            </div>
                                            <div className="col-span-1">
                                                <button type="button" onClick={() => removeSubjectRow(index)} className="text-red-600 mt-6">
                                                    <Trash2 size={22} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1 py-4 border rounded-2xl font-medium">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-medium">Create Exam</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Subjects Modal */}
            {showSubjectsModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="px-8 py-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Exam Subjects Schedule</h2>
                            <button onClick={() => setShowSubjectsModal(false)}><X size={26} /></button>
                        </div>
                        <div className="p-8 overflow-auto">
                            {viewSubjects.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">No subjects found for this exam</p>
                            ) : (
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3">Subject</th>
                                        <th className="text-left py-3">Date</th>
                                        <th className="text-left py-3">Time</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {viewSubjects.map((sub, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="py-4 font-medium">{sub.subject_name} ({sub.subject_code})</td>
                                            <td className="py-4">{formatDate(sub.exam_date)}</td>
                                            <td className="py-4">{sub.exam_time || "—"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && currentExam && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
                        <h3 className="text-xl font-semibold mb-2">Delete Exam?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{currentExam.exam_name}</strong>?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border rounded-2xl">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-2xl">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Exams;