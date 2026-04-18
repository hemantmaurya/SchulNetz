import { useState, useEffect } from "react";
import API from "../lib/api.js";

function ViewAttendance() {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchAttendance = async (page = 1, newLimit = limit) => {
    try {
      const res = await API.get(
        `/api/viewattendance?page=${page}&limit=${newLimit}`
      );

      setRecords(res.data.data || []);
      setPagination(
        res.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit: newLimit
        }
      );

      setCurrentPage(page);
      setLimit(newLimit);
    } catch (err) {
      console.error("Attendance Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchAttendance(1, limit);
  }, []);

  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = currentPage;
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);

      if (current > 4) pages.push("...");

      const start = Math.max(2, current - 2);
      const end = Math.min(total - 1, current + 2);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (current < total - 3) pages.push("...");
      if (!pages.includes(total)) pages.push(total);
    }

    return pages;
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    fetchAttendance(1, newLimit);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          View Attendance
        </h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50">
          <h2 className="font-medium">Attendance Records</h2>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Show</span>

            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2"
            >
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
              <tr className="border-b">
                <th className="text-left py-5 px-8">ID</th>
                <th className="text-left py-5 px-8">Attendance ID</th>
                <th className="text-left py-5 px-8">Student ID</th>
                <th className="text-left py-5 px-8">Status</th>
                <th className="text-left py-5 px-8">Remark</th>
                <th className="text-left py-5 px-8">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-5 px-8">{record.id}</td>
                    <td className="py-5 px-8">{record.attendance_id}</td>
                    <td className="py-5 px-8">{record.student_id}</td>
                    <td className="py-5 px-8">{record.status}</td>
                    <td className="py-5 px-8">
                      {record.remark || "—"}
                    </td>
                    <td className="py-5 px-8">
                      {record.created_at
                        ? new Date(record.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >
                    No Attendance Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="px-8 py-6 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * limit + 1}–
              {Math.min(
                currentPage * limit,
                pagination.totalRecords
              )}{" "}
              of {pagination.totalRecords} records
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchAttendance(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-5 py-2 border rounded-2xl disabled:opacity-50"
              >
                Previous
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3">
                    …
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => fetchAttendance(page)}
                    className={`w-10 h-10 rounded-2xl ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => fetchAttendance(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-5 py-2 border rounded-2xl disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAttendance;