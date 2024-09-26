import { useState, useEffect } from "react";
import "../css/LoginPage.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from 'axios';

const LoginPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successCreation, setSuccessCreation] = useState("");

    useEffect(() => {
      if (location.state) {
        const { email, message} = location.state;
        setEmail(email || "");
        setSuccessCreation(message || "");
        navigate(location.pathname, { replace: true }); // Navigate to itself clearing creation states passed
      }
    }, [location.state, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3001/login', {email, password});
          if (response.data.success)
            navigate("/home");
        }
        catch(err){
          setPassword("");
          if (err.response && err.response.data && err.response.data.message)
            setError(err.response.data.message);
          else
            setError('An error has occured');
        }
    };

    return (
      <div className="login-background-container">
        <div className="login-page">
          <div className="login-box">
            <h2>Login Page</h2>
            <form onSubmit={handleLogin}>
              <div className="label-input">
                <label>Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <button className="login-button">Login</button>
              <div className="error-login-page">
                {error && <p>{error}</p>}
              </div>
              <div className="success-account-creation">
                {successCreation && <p>{successCreation}</p>}
              </div>
              <div className="separator-container">
                <div className="separator">
                  <span>or</span>
                </div>
              </div>
            </form>
            <Link to="/create-account">
              <button className="create-account-option">Sign up for Rewards</button>
            </Link>
          </div>
        </div>
      </div>
    );
}
 
export default LoginPage;