// CreateUser.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateUser = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Validate in real time
  useEffect(() => {
    const newErrors = {
      email:
        formData.email &&
        formData.confirmEmail &&
        formData.email !== formData.confirmEmail
          ? "Emails do not match"
          : "",
      password:
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
          ? "Passwords do not match"
          : "",
    };
  
    setErrors(newErrors);
  
    const allFilled =
      formData.username &&
      formData.email &&
      formData.confirmEmail &&
      formData.password &&
      formData.confirmPassword &&
      formData.role;
  
    const noErrors = !newErrors.email && !newErrors.password;
  
    setIsFormValid(allFilled && noErrors);
  }, [
    formData.email,
    formData.confirmEmail,
    formData.password,
    formData.confirmPassword,
    formData.username,
    formData.role,
  ]);

  
  
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      const token = localStorage.getItem("access_token");
      // Send only relevant fields to backend
      const { confirmEmail, confirmPassword, ...payload } = formData;
      await axios.post("http://localhost:8000/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User created successfully");
      onClose(); // Close modal on success
    } catch (error) {
      alert("Error creating user");
    }
  };

  return (
    <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit} className="modal-form">
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
            name="confirmEmail"
            type="email"
            placeholder="Confirm Email"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
          />
          <div className="error-space">
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <div className="error-space">
              {errors.password && <div className="error">{errors.password}</div>}
          </div>
        
        <select name="role" placeholder= "Role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={!isFormValid}>Create</button>
      </form>
    </div>
  </div>
  );
};

export default CreateUser;