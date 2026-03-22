import { useEffect, useState } from "react";
import axios from "axios";

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    // Fetch courses
    const fetchCourses = async () => {
        const res = await axios.get("http://localhost:4000/api/courses");
        setCourses(res.data);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Open modal for add
    const handleOpenAdd = () => {
        setName("");
        setEditingId(null);
        setOpen(true);
    };

    // Open modal for edit
    const handleEdit = (course) => {
        setName(course.name);
        setEditingId(course._id);
        setOpen(true);
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            await axios.put(`http://localhost:4000/api/courses/${editingId}`, {
                name,
            });
        } else {
            await axios.post("http://localhost:4000/api/courses", { name });
        }

        setOpen(false);
        fetchCourses();
    };

    // Delete
    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;

        await axios.delete(`http://localhost:4000/api/courses/${id}`);
        fetchCourses();
    };

    return (
        <div className="max-w-5xl mx-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">
                    Course Management
                </h1>

                <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 bg-black text-white rounded-lg"
                >
                    + Add Course
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white p-6 rounded-2xl shadow">
                {courses.length === 0 ? (
                    <p className="text-gray-500">No courses found</p>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-sm text-gray-500 border-b">
                            <th className="py-2">#</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {courses.map((course, index) => (
                            <tr key={course._id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{index + 1}</td>
                                <td>{course.name}</td>

                                <td className="flex gap-3 py-2">
                                    <button
                                        onClick={() => handleEdit(course)}
                                        className="text-blue-600 text-sm"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="text-red-600 text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-full max-w-md">

                        <h2 className="text-lg font-semibold mb-4">
                            {editingId ? "Edit Course" : "Add Course"}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Course name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-black"
                                required
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-lg"
                                >
                                    {editingId ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}

export default CoursesPage;