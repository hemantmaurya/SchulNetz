import { useState, useEffect } from "react";
import API from "../lib/api.js";

function CourseSemSub() {
  // ================= DATA =================
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // ================= SELECTED =================
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(""); // course_sem_assign_id
  const [selectedSubject, setSelectedSubject] = useState("");

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await API.get("/api/course-sem-sub/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error("Courses fetch error:", err);
    }
  };

  // ================= FETCH SEMESTERS =================
  const fetchSemesters = async (courseId) => {
    try {
      console.log("Frontend → Calling API with courseId:", courseId);   // ← Added

      const res = await API.get(`/api/course-sem-sub/semesters/${courseId}`);

      console.log("Frontend → Semesters API Response:", res.data);
      setSemesters(res.data?.data || []);
    } catch (err) {
      console.error("Semesters fetch error:", err);
    }
  };

  // ================= FETCH SUBJECTS =================
  const fetchSubjects = async (courseSemAssignId) => {
    try {
      const res = await API.get(`/api/course-sem-sub/subjects/${courseSemAssignId}`);
      setSubjects(res.data?.data || []);
    } catch (err) {
      console.error("Subjects fetch error:", err);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= COURSE CHANGE =================
  const handleCourseChange = (e) => {
    const courseId = e.target.value;

    setSelectedCourse(courseId);
    setSelectedSemester("");
    setSelectedSubject("");

    setSemesters([]);
    setSubjects([]);

    if (courseId) fetchSemesters(courseId);
  };

  // ================= SEMESTER CHANGE =================
  const handleSemesterChange = (e) => {
    const courseSemAssignId = e.target.value;

    setSelectedSemester(courseSemAssignId);
    setSelectedSubject("");

    setSubjects([]);

    if (courseSemAssignId) fetchSubjects(courseSemAssignId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold">Course Mapping</h1>
      </div>

      {/* CARD */}
      <div className="bg-white p-8 rounded-3xl shadow-md max-w-2xl space-y-6">

        {/* COURSE */}
        <div>
          <label className="text-sm text-gray-500">Course</label>
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="w-full border p-4 rounded-2xl mt-2"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name}
              </option>
            ))}
          </select>
        </div>

        {/* SEMESTER */}
        <div>
          <label className="text-sm text-gray-500">Semester</label>
          <select
            value={selectedSemester}
            onChange={handleSemesterChange}
            disabled={!selectedCourse}
            className="w-full border p-4 rounded-2xl mt-2 disabled:bg-gray-100"
          >
            <option value="">Select Semester</option>

            {semesters.map((s) => (
              <option key={s.course_sem_assign_id} value={s.course_sem_assign_id}>
                {s.semester_name}
              </option>
            ))}
          </select>
        </div>

        {/* SUBJECT */}
        <div>
          <label className="text-sm text-gray-500">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedSemester}
            className="w-full border p-4 rounded-2xl mt-2 disabled:bg-gray-100"
          >
            <option value="">Select Subject</option>

            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.subject_name}
              </option>
            ))}
          </select>
        </div>

        {/* PREVIEW */}
        <div className="p-5 bg-gray-50 border rounded-2xl">
          <p>Course ID: {selectedCourse || "-"}</p>
          <p>Course-Sem ID: {selectedSemester || "-"}</p>
          <p>Subject ID: {selectedSubject || "-"}</p>
        </div>

      </div>
    </div>
  );
}

export default CourseSemSub;