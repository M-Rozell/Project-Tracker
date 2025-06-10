import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./css/App.css";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return (
    <Router>
      <Routes>
  {user ? (
    <>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </>
  ) : (
    <>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )}
</Routes>
    </Router>
  );
};

export default App;




