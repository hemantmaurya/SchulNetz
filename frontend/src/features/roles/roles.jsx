import { useState, useEffect } from "react";
import API from "../../lib/api.js";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");

  //  FETCH ROLES
  const fetchRoles = async () => {
    try {
      const res = await API.get("/api/roles");   //  FIXED

      console.log("GET RESPONSE 👉", res.data);

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

  //  ADD ROLE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("SENDING 👉", roleName);

      await API.post("/api/roles", {   //  FIXED
        role_name: roleName
      });

      setRoleName("");

      fetchRoles();
    } catch (err) {
      console.error("POST ERROR ", err.response?.data || err.message);
      alert("Error adding role");
    }
  };

  return (
    <div className="p-8">

      <h2 className="text-xl font-semibold mb-6">Roles Records</h2>

      {/* ADD FORM */}
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
          + Add Role
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
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