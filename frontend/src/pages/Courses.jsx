import { useState, useEffect } from 'react';
import API from '../lib/api.js';
import { Edit2, Trash2 } from 'lucide-react';

function Courses() {
  const [records, setRecords] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    description: '',
    duration: '',
    total_semesters: '',
    credits: '',
    course_type: ''
  });

  const fetchCourses = async () => {
    try {
      const res = await API.get('/api/courses');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/courses', formData);
      setShowAddModal(false);
      fetchCourses();
      setFormData({
        course_code: '',
        course_name: '',
        description: '',
        duration: '',
        total_semesters: '',
        credits: '',
        course_type: ''
      });
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add course');
    }
  };

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setFormData({ ...record });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/courses/${currentRecord.course_id}`, formData);
      setShowEditModal(false);
      fetchCourses();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update course');
    }
  };

  const handleDeleteClick = (record) => {
    setCurrentRecord(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/api/courses/${currentRecord.course_id}`);
      setShowDeleteModal(false);
      fetchCourses();
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Courses</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-black text-white px-6 py-3 rounded-xl">
          + Add Course
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Duration</th>
              <th className="p-4 text-left">Semesters</th>
              <th className="p-4 text-left">Credits</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.course_id} className="border-b hover:bg-gray-50">
                <td className="p-4">{record.course_code}</td>
                <td className="p-4">{record.course_name}</td>
                <td className="p-4">{record.duration}</td>
                <td className="p-4">{record.total_semesters}</td>
                <td className="p-4">{record.credits}</td>
                <td className="p-4">{record.course_type}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEditClick(record)} className="mr-2"><Edit2 size={18} /></button>
                  <button onClick={() => handleDeleteClick(record)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-xl">
            <h2 className="text-2xl font-semibold mb-6">{showEditModal ? 'Edit Course' : 'Add Course'}</h2>
            <form onSubmit={showEditModal ? handleEditSubmit : handleAddSubmit} className="grid grid-cols-2 gap-4">
              {Object.keys(formData).map((field) => (
                <input
                  key={field}
                  type={field.includes('duration') || field.includes('credits') || field.includes('semesters') ? 'number' : 'text'}
                  placeholder={field.replaceAll('_', ' ')}
                  className="border p-3 rounded-xl"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              ))}
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="flex-1 border py-3 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 bg-black text-white py-3 rounded-xl">{showEditModal ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Delete Course?</h2>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 border py-3 rounded-xl">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 bg-red-600 text-white py-3 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;