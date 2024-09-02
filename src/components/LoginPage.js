import { useState } from "react";
import "../css/LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/home");
    }

    return (
      <div className="login-box">
        <h2>Login Page</h2>
        <form onSubmit={ handleLogin }>
          <div className="label-input">
            <label>Username:</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="label-input">
            <label>Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button>Login</button>
        </form>
      </div>
    );
}
 
export default LoginPage;