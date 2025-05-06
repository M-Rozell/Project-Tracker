import { useState } from "react";
import { useAuth } from "../utils/AuthContext";

const Login = ({ setLogin }) => {
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
        setLogin(false);
        console.log("Form Cleared!");
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
                <button onClick={handleReset} type="button">Clear</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
