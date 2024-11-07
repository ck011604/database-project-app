import { useEffect, useState } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import "../css/EmployeeSettings.css";

const EmployeeSettings = () => {
    const [oldEmail, setOldEmail] = useState("");
    const [oldFirstName, setOldFirstName] = useState("");
    const [oldLastName, setOldLastName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [error, setError] = useState("");
    const [lockEmpSetting, setLockEmpSetting] = useState(false);

    const token = sessionStorage.getItem("token");
    let employeeID = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            employeeID = decodedToken.employee_id;
        } catch (error) {
            console.error("Failed to decode token", error);
        }
    }

    useEffect(() => {
        const loadEmployeeData = async () => {
            try {
                const employeeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees/${employeeID}`);
                const employee = employeeResponse.data.employee;
                if (employeeResponse.data.success) {
                    setOldEmail(employee.email);
                    setOldFirstName(employee.first_name);
                    setOldLastName(employee.last_name);
                    setOldPassword(employee.password);
                }
            }
            catch (err) {
                if (err.response && err.response.data && err.response.data.message)
                    setError(err.response.data.message);
                else
                    setError('An error has occured loading employee data');
            }
        }
        loadEmployeeData();
        setError("");
    },[]);
    const handleSaveChangeEmployee = async (e) => {
        e.preventDefault();
        if (newPassword.length > 0 && newPassword != newPassword2) {
            setError("New Password doesn't match")
            return;
        }
        setLockEmpSetting(true);
        console.log("form is locked");
        
    }

    return (
        <div className="employee-setting-container">
            <div className="employee-settings">
                <h1>Settings</h1>
                <form onSubmit={handleSaveChangeEmployee}>
                    <div className="input-field">
                        <label>First Name: </label>
                        <input
                            type="text"
                            value={newFirstName}
                            onChange={(e) => {setNewFirstName(e.target.value)}}
                            placeholder={oldFirstName}
                            disabled={lockEmpSetting}
                        />
                    </div>
                    <div className="input-field">
                        <label>Last Name: </label>
                        <input
                            type="text"
                            value={newLastName}
                            onChange={(e) => { setNewLastName(e.target.value) }}
                            placeholder={oldLastName}
                            disabled={lockEmpSetting}
                        />
                    </div>
                    <div className="input-field">
                        <label>Email: </label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => { setNewEmail(e.target.value) }}
                            placeholder={oldEmail}
                            disabled={lockEmpSetting}
                        />
                    </div>
                    <div className="input-field">
                        <label>Password: </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => { setNewPassword(e.target.value) }}
                            placeholder="Enter new password"
                            disabled={lockEmpSetting}
                        />
                    </div>
                    {newPassword.length > 0 && (<div className="input-field">
                        <label>Confirm Password: </label>
                        <input
                            type="password"
                            value={newPassword2}
                            onChange={(e) => { setNewPassword2(e.target.value) }}
                            placeholder="Must be the same as above"
                            disabled={lockEmpSetting}
                        />
                    </div>)}
                    <button 
                        className="edit-employee-button" 
                        disabled={lockEmpSetting || 
                        (newFirstName === "" &&  newLastName === "" && newPassword === "" && newEmail === "")}>
                    Save Changes</button>
                    {error && <p>{error}</p>}
                </form>
            </div>
        </div>
        {} 
     );
}
 
export default EmployeeSettings;