import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUsers, updateUserRole, deleteUser } from "../../services/api";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      toast.success("User role updated");
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "btn-danger",
      candidate: "btn-primary",
      "business owner": "btn-success",
    };

    return <span className={`btn btn-sm ${roleColors[role]}`}>{role}</span>;
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Users Management</h1>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">All Users</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <select
                      className="btn btn-sm"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleUpdate(user._id, e.target.value)
                      }
                    >
                      <option value="candidate">Candidate</option>
                      <option value="business owner">Business Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
