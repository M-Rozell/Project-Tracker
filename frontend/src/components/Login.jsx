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
        <div className="loginWrapper">
            <h1
                className="loginTitle"
            >Login
            </h1>
            <form
            className="loginFormWrapper" 
            onSubmit={handleSubmit}
            >
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="formBtnWrapper">
                    <button type="submit">Login</button>
                    <button onClick={handleReset} type="button">Clear</button>
                </div>
                
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
