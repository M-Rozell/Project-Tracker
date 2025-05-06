import { useAuth } from "./utils/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./css/App.css";

const App = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  return (
    <div>
      {user ? (
        <>
          <Dashboard user={user} />
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;




