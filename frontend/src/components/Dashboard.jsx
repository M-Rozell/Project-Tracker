import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CreateUser from "./pages/admin/CreateUser";
import EditUser from "./pages/admin/EditUser";
import DeleteUser from "./pages/admin/DeleteUser";
import ListUsers from "./pages/admin/ListUsers";
import { useAuth } from "../utils/AuthContext";
import "../css/Dashboard.css";

const Dashboard = () => {
  
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'delete' | 'list'
  const { logout, user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!user.role) return <p>Error: No role found in user object.</p>;
  
  
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
      <div className="logout-btn-container">
        <button onClick={logout} className="logout-button">Logout</button>
      </div>
      {user.role === "admin" && (
        <div>
          <p className="welcomeDashboard">{user.sub} ({user.role})</p>
          
          <ul className="dashboard-options">
            
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


      {user.role === "manager" && (
        <div>
          <p className="welcomeDashboard">{user.sub} ({user.role})</p>
          <ul className="dashboard-options">
            <li>Create Project</li>
            <li>Edit Project</li>
            <li>View All Projects</li>
          </ul>
        </div>
      )}

      {user.role === "user" && (
        <div>
          <p className="mb-2">{user.sub} ({user.role})</p>
          <ul className="space-y-2">
            <li>View Your Projects</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

