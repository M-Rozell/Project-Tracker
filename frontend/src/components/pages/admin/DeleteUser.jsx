// DeleteUser.jsx
import React, { useState } from "react";
import axios from "axios";

const DeleteUser = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);


  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`http://localhost:8000/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = res.data.find((u) => u.username === username);
      if (user) {
        setUserDetails(user);
        setShowConfirm(true);
      } else {
        alert("User not found.");
      }
    } catch (error) {
      alert("Failed to fetch user details.");
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully");
      onClose();
    } catch (error) {
      if (
        error.response?.data?.detail === "You cannot delete yourself."
      ) {
        alert("You cannot delete yourself.");
      } else {
        alert("Error deleting user");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showConfirm) {
      await fetchUserDetails();
    } else {
      await confirmDelete();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Delete User</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          {!showConfirm ? (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowConfirm(false);
                  setUserDetails(null);
                }}
                required
              />
              <button type="submit">Next</button>
            </>
          ) : (
            <>
              <p>
                Are you sure you want to delete the following user from the database?
              </p>
              <ul>
                <li><strong>Username:</strong> {userDetails.username}</li>
                <li><strong>Email:</strong> {userDetails.email}</li>
                <li><strong>Role:</strong> {userDetails.role}</li>
              </ul>
              <button type="submit">Yes, Delete</button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setUserDetails(null);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteUser;