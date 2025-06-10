import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import CreateUser from "./pages/admin/CreateUser";
import EditUser from "./pages/admin/EditUser";
import DeleteUser from "./pages/admin/DeleteUser";
import ListUsers from "./pages/admin/ListUsers";
import { useAuth } from "../utils/AuthContext";
import "../css/Dashboard.css";

const Dashboard = (username) => {
  const [role, setRole] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'delete' | 'list'
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  const toggleUserDropdown = () => {
    setShowUserDropdown((prev) => !prev);
  };

  const openModal = (type) => {
    setActiveModal(type);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };
  

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <button onClick={logout} className="logout-button">Logout</button>
      {role === "admin" && (
        <div>
          <p className="welcomeDashboard">Welcome!</p>
          
          <ul className="admin-options">
            
            <li>Manage Projects</li>
            {/* Manage Users Dropdown */}
            <li>
              <button className="dropdown-btn" onClick={toggleUserDropdown}>
                Manage Users ▾
              </button>
              {showUserDropdown && (
                <ul className="dropdown-menu">
                  <li><button onClick={() => openModal("create")}>Create</button></li>
                  <li><button onClick={() => openModal("edit")}>Edit</button></li>
                  <li><button onClick={() => openModal("delete")}>Delete</button></li>
                  <li><button onClick={() => openModal("list")}>List</button></li>
                </ul>
              )}
            </li>
            <li>View All Projects</li>
          </ul>
        </div>
      )}
      {/* Nested Routes Render Here */}
      {activeModal === "create" && <CreateUser onClose={closeModal} />}
      {activeModal === "edit" && <EditUser onClose={closeModal} />}
      {activeModal === "delete" && <DeleteUser onClose={closeModal} />}
      {activeModal === "list" && <ListUsers onClose={closeModal} />}


      {role === "manager" && (
        <div>
          <p className="mb-2">Welcome!</p>
          <ul className="space-y-2">
            <li>Create Project</li>
            <li>Edit Project</li>
            <li>View All Projects</li>
          </ul>
        </div>
      )}

      {role === "user" && (
        <div>
          <p className="mb-2">Welcome, User!</p>
          <ul className="space-y-2">
            <li>View Your Projects</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

