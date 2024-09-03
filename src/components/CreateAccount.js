import { useState } from "react";

const CreateAccount = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleCreateAccount = async (e) => {
        e.preventDefault();
    }

    return ( <div className="create-account-page">
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
                <button>Create Account</button>
            </form>
        </div>
    </div> );
}
 
export default CreateAccount;