import { useState } from "react";

function CourseForm({ onAdd }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(name);
        setName("");
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
            <h2 className="text-lg font-medium mb-4">Add Course</h2>

            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="text"
                    placeholder="Enter course name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />

                <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-lg"
                >
                    Add
                </button>
            </form>
        </div>
    );
}

export default CourseForm;