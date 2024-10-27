import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../css/CreateAccount.css";

const CreateAccount = () => {

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${REACT_APP_API_URL}/create-account`, { email, firstName, lastName, password });
            if (response.data.success)
                navigate("/login", {replace: true, state: {email: email, message: 'Account successfully created!'}});
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message)
                setError(err.response.data.message);
            else
                setError('An error has occured');
        }
    };

    return ( 
        <div className="create-background-container">
            <div className="create-account-page">
                <div className="create-account-box">
                    <h2>Create Account</h2>
                    <form onSubmit={handleCreateAccount}>
                        <div className="label-input">
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="label-input">
                            <label>First Name</label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="label-input">
                            <label>Last Name</label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="label-input">
                            <label>Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="create-account-button">Create Account</button>
                        {error && <p>{error}</p>}
                    </form>
                </div>
            </div>
        </div> 
    );
}
 
export default CreateAccount;