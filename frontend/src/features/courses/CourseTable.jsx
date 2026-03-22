function CourseTable({ courses }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-medium mb-4">All Courses</h2>

            {courses.length === 0 ? (
                <p className="text-gray-500 text-sm">No courses found</p>
            ) : (
                <table className="w-full text-left">
                    <thead>
                    <tr className="text-sm text-gray-500 border-b">
                        <th className="py-2">#</th>
                        <th>Name</th>
                    </tr>
                    </thead>

                    <tbody>
                    {courses.map((course, index) => (
                        <tr key={course._id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{index + 1}</td>
                            <td>{course.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CourseTable;