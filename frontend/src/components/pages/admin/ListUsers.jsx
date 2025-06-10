// ListUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ListUsers = ({ onClose }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <h2>List of Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username} {user.email} ({user.role})</li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default ListUsers;