import { useState } from "react";
import Login from "./components/Login";
import "./css/App.css"
import Dashboard from "./components/Dashboard";

  
  const App = () => {
    
    const [login, setLogin] = useState(false);

    const handleLogOut = () => {
      setLogin(false);
      localStorage.removeItem("token");  // Optional, if you store token
    }

    return (
    <>
    
    <div>
      {login ? (
        <>
        <Dashboard />
        <button on onClick={handleLogOut}>Logout</button>
        </>
      ) : (
        <Login 
        setLogin={setLogin}
        login={login}/>
      )}
      </div>
    </>
    )
  };

  
  export default App;



