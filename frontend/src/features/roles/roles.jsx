import { useState, useEffect } from "react";
import API from "../../lib/api.js";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [editId, setEditId] = useState(null); 

  // FETCH ROLES
  const fetchRoles = async () => {
    try {
      const res = await API.get("/api/roles");

      const data =
        res.data?.data ||
        res.data?.rows ||
        res.data?.roles ||
        res.data;

      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GET ERROR ", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ADD / UPDATE ROLE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        //  UPDATE
        await API.put(`/api/roles/${editId}`, {
          role_name: roleName,
        });
      } else {
        //  CREATE
        await API.post("/api/roles", {
          role_name: roleName,
        });
      }

      setRoleName("");
      setEditId(null); // reset
      fetchRoles();

    } catch (err) {
      console.error("SAVE ERROR ", err.response?.data || err.message);
      alert("Error saving role");
    }
  };

  // DELETE ROLE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this role?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/api/roles/${id}`);
      fetchRoles();
    } catch (err) {
      console.error("DELETE ERROR ", err);
      alert("Error deleting role");
    }
  };

  // EDIT ROLE
  const handleEdit = (role) => {
    setRoleName(role.role_name || role.name);
    setEditId(role.id || role.role_id);
  };

  return (
    <div className="p-8">

      <h2 className="text-xl font-semibold mb-6">Roles Records</h2>

      {/* ADD / UPDATE FORM */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Enter Role Name"
          className="border px-4 py-2 rounded w-80"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          required
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          {editId ? "Update Role" : "+ Add Role"}
        </button>
      </form>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 font-medium">
          All Roles
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">ID</th>
              <th className="p-4">Role Name</th>
              <th className="p-4">Actions</th> {/* NEW */}
            </tr>
          </thead>

          <tbody>
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <tr key={role.id || index} className="border-b">
                  <td className="p-4">
                    {role.id || role.role_id || index + 1}
                  </td>

                  <td className="p-4">
                    {role.role_name || role.name}
                  </td>

                  {/*  ACTION BUTTONS */}
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(role)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(role.id || role.role_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Roles;