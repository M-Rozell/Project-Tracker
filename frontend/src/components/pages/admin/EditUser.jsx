// EditUser.jsx
import React, { useState } from "react";
import axios from "axios";

const EditUser = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`http://localhost:8000/users/${username}`, { role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully");
    } catch (error) {
      alert("Error updating user");
    }
  };

  return (
    <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
    <form onSubmit={handleSubmit} className="modal-form">
      <h2>Edit User Role</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Update</button>
    </form>
    </div>
  </div>
  );
};

export default EditUser;