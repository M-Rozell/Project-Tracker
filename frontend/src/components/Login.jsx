import { useState } from "react";
import axios from "axios";

const Login = ({login, setLogin}) => {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Prepare the form data for the request
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await axios.post("http://127.0.0.1:8000/login",formData, {
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded", // Set correct content type
                }
            });
            
            console.log("Logged in:", response.data);
        } catch (err) {
            setError("Invalid username or password.");
        }
        setLogin(true)
    };

    const handleReset = () => {
        setUsername("")
        setPassword("")
        setError("")
        setLogin(false)
        console.log("Form Cleared!")
    }
    const handleLogOut = () => {
        console.log(username, "Logged Out")
    }

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
            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;
