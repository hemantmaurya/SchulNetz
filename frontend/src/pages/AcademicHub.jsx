import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AcademicHub = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const [formData, setFormData] = useState({
        type: '',
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        expiry_date: '',
        delete_at: '',
        event_details: '',
        target_all: true,
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const types = ['announcement', 'notice', 'news', 'event', 'other'];

    useEffect(() => {
        fetchPosts();
    }, [page, limit]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/academic?page=${page}&limit=${limit}`);
            setPosts(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setTotalPosts(res.data.pagination?.totalRecords || 0);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'type') setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cleanType = formData.type ? formData.type.toString().trim().toLowerCase() : '';

        console.log("🔹 Sending Type to Backend:", cleanType);

        if (!cleanType) {
            setError("❌ Post Type is required!");
            return;
        }
        if (!formData.title || formData.title.trim() === '') {
            setError("❌ Title is required!");
            return;
        }
        if (!formData.expiry_date) {
            setError("❌ Expiry Date is required!");
            return;
        }

        setSubmitting(true);

        const data = new FormData();

        data.append('type', cleanType);
        data.append('title', formData.title.trim());
        if (formData.description) data.append('description', formData.description.trim());
        if (formData.start_date) data.append('start_date', formData.start_date);
        if (formData.end_date) data.append('end_date', formData.end_date);
        data.append('expiry_date', formData.expiry_date);
        if (formData.event_details) data.append('event_details', formData.event_details.trim());
        if (formData.delete_at) data.append('delete_at', formData.delete_at);
        data.append('target_all', formData.target_all);

        if (selectedFile) data.append('attachment', selectedFile);

        try {
            if (isEditMode && selectedPost?.id) {
                await axios.put(`/api/academic/${selectedPost.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('✅ Post Updated Successfully!');
            } else {
                await axios.post('/api/academic', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('✅ Post Created Successfully!');
            }

            setShowModal(false);
            resetForm();
            setTimeout(() => fetchPosts(), 300);
        } catch (err) {
            console.error("Submit Error:", err.response?.data);
            const msg = err.response?.data?.message || 'Something went wrong';
            setError(`❌ ${msg}`);
            alert(`❌ ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            type: '', title: '', description: '', start_date: '', end_date: '',
            expiry_date: '', delete_at: '', event_details: '', target_all: true
        });
        setSelectedFile(null);
        setError('');
        setIsEditMode(false);
        setSelectedPost(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsViewMode(false);
        setIsEditMode(false);
        setShowModal(true);
    };

    const openViewModal = (post) => {
        setSelectedPost(post);
        setIsViewMode(true);
        setIsEditMode(false);
        setShowModal(true);
    };

    const openEditModal = (post, e) => {
        if (e) e.stopPropagation();

        setSelectedPost(post);

        setFormData({
            type: post.type ? String(post.type).toLowerCase() : '',
            title: post.title || '',
            description: post.description || '',
            start_date: post.start_date ? post.start_date.split('T')[0] : '',
            end_date: post.end_date ? post.end_date.split('T')[0] : '',
            expiry_date: post.expiry_date ? post.expiry_date.split('T')[0] : '',
            delete_at: post.delete_at ? post.delete_at.slice(0, 16) : '',
            event_details: post.event_details
                ? (typeof post.event_details === 'object' ? JSON.stringify(post.event_details) : String(post.event_details))
                : '',
            target_all: post.target_all ?? true,
        });

        setSelectedFile(null);
        setIsViewMode(false);
        setIsEditMode(true);
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await axios.delete(`/api/academic/${id}`);
            alert('✅ Post Deleted Successfully!');
            fetchPosts();
        } catch (err) {
            alert('❌ Failed to delete post');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">📢 Academic Information Hub</h1>
                        <p className="text-gray-600 mt-2">Announcements, Notices, News & Events</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all flex items-center gap-3"
                    >
                        ➕ Create New Post
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Show</span>
                        <select
                            value={limit}
                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                            className="px-4 py-2 border border-gray-300 rounded-2xl"
                        >
                            <option value={5}>5</option>
                            <option value={9}>9</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>
                        <span className="text-sm text-gray-600">per page</span>
                    </div>
                    <div className="text-sm text-gray-600">Showing {posts.length} of {totalPosts} posts</div>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="text-center py-20 text-xl">Loading posts...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 relative group"
                            >
                                <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                                <div className="p-7 pb-24">
                                    <span className="px-5 py-1.5 text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full">
                                        {post.type}
                                    </span>
                                    <h3 className="text-2xl font-semibold mt-5 mb-3 line-clamp-2">{post.title}</h3>
                                    <p className="text-gray-600 line-clamp-4 mb-6">{post.description}</p>

                                    {post.attachment_url && (
                                        <a href={post.attachment_url} target="_blank" className="text-indigo-600 text-sm hover:underline">
                                            📎 Attachment
                                        </a>
                                    )}

                                    <div className="mt-8 text-xs text-gray-500">
                                        Expires: {new Date(post.expiry_date).toLocaleDateString('en-IN')}
                                    </div>
                                </div>

                                <div className="absolute bottom-5 right-5 flex gap-2 z-30">
                                    <button
                                        onClick={(e) => openEditModal(post, e)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-2xl text-sm font-medium shadow-md"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(post.id, e)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-2xl text-sm font-medium shadow-md"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>

                                <div
                                    className="absolute inset-0 z-10 cursor-pointer"
                                    onClick={() => openViewModal(post)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-16 gap-3 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setPage(num)}
                            className={`w-12 h-12 rounded-2xl font-semibold ${page === num ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-8">
                            {isViewMode ? (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-3xl font-bold">Post Details</h2>
                                        <button onClick={() => setShowModal(false)} className="text-4xl text-gray-400 hover:text-gray-600">×</button>
                                    </div>
                                    <div className="space-y-6">
                                        <span className="px-5 py-1.5 text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full">
                                            {selectedPost.type}
                                        </span>
                                        <h3 className="text-3xl font-semibold">{selectedPost.title}</h3>
                                        <p className="text-gray-700 text-lg whitespace-pre-wrap">{selectedPost.description}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-3xl font-bold">
                                            {isEditMode ? 'Edit Academic Post' : 'Create New Academic Post'}
                                        </h2>
                                        <button onClick={() => setShowModal(false)} className="text-4xl text-gray-400 hover:text-gray-600">×</button>
                                    </div>

                                    {error && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Post Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="w-full px-6 py-4 border border-gray-300 rounded-2xl text-lg focus:outline-none focus:border-indigo-500"
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                {types.map(t => (
                                                    <option key={t} value={t}>
                                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {formData.type && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Title <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        placeholder="Enter Title"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                        className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                    <textarea
                                                        name="description"
                                                        placeholder="Enter description..."
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        className="w-full px-6 py-4 border border-gray-300 rounded-2xl h-32 focus:outline-none focus:border-indigo-500"
                                                    />
                                                </div>

                                                {formData.type === 'event' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                                                            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-6 py-4 border border-gray-300 rounded-2xl" />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                                                            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-6 py-4 border border-gray-300 rounded-2xl" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">
                                                        Expiry Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="expiry_date"
                                                        value={formData.expiry_date}
                                                        onChange={handleChange}
                                                        className="w-full px-6 py-4 border border-gray-300 rounded-2xl"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Auto Delete Date & Time (optional)</label>
                                                    <input
                                                        type="datetime-local"
                                                        name="delete_at"
                                                        value={formData.delete_at}
                                                        onChange={handleChange}
                                                        className="w-full px-6 py-4 border border-gray-300 rounded-2xl"
                                                    />
                                                </div>

                                                {formData.type === 'event' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Details</label>
                                                        <textarea
                                                            name="event_details"
                                                            placeholder='{"location": "Auditorium", "time": "10:00 AM"}'
                                                            value={formData.event_details}
                                                            onChange={handleChange}
                                                            className="w-full px-6 py-4 border border-gray-300 rounded-2xl h-28"
                                                        />
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
                                                    <input
                                                        type="file"
                                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                                        className="w-full px-6 py-4 border border-gray-300 rounded-2xl"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="flex gap-4 pt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="flex-1 py-4 border border-gray-400 rounded-2xl font-semibold hover:bg-gray-100 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:brightness-105 disabled:opacity-70 transition"
                                            >
                                                {submitting ? 'Saving...' : isEditMode ? 'Update Post' : 'Publish Post'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicHub;