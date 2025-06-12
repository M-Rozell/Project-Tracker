import { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import "../css/login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(username, password);
            console.log("Login successful");
        } catch (err) {
            console.error(err);
            setError("Invalid username or password.");
        }
    };

    const handleReset = () => {
        setUsername("");
        setPassword("");
        setError("");
        console.log("Form Cleared!");
    };

    return (
        <div className="login-container">
            <h1
                className="login-txt"
            >ENTER
            </h1>
            <form
            className="login-form-container" 
            onSubmit={handleSubmit}
            >
                <div>                
                    <input
                        type="text"
                        placeholder="Username"
                        className="login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-btn-container">
                    <button type="submit">YES</button>
                    <button onClick={handleReset} type="button">NO</button>
                </div>
                
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
