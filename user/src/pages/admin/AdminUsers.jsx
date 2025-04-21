import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3001/api/users/${id}`);
        alert("User deleted successfully");
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/api/users/${editUser._id}`, {
        ...editUser,
      });
      alert("User updated successfully");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <h2>Admin: Manage Users</h2>

      {editUser ? (
        <div>
          <h3>Edit User</h3>
          <form>
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={editUser.username}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>Role</label>
              <select
                name="role"
                value={editUser.role}
                onChange={handleChange}
                className="form-control"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-success"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditUser(null)}
              className="btn btn-secondary ms-2"
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <div>
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;