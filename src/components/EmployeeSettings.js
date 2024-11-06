import { useEffect, useState } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const EmployeeSettings = () => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
                    setEmail(employee.email);
                    setFirstName(employee.first_name);
                    setLastName(employee.last_name);
                    setPassword(employee.password);
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
    },[]);
    const handleSaveChangeEmployee = async (e) => {
        e.preventDefault();
    }

    return ( 
        <div className="employee-settings">
            <h1>Settings</h1>
            <form onSubmit={handleSaveChangeEmployee}>
                <div className="input-field">
                    <label>First Name: </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => {setFirstName(e.target.value)}}
                    />
                </div>
                <div className="input-field">
                    <label>Last Name: </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value) }}
                    />
                </div>
                <div className="input-field">
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                </div>
                <div className="input-field">
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                </div>
                <button className="edit-employee-button">Save Changes</button>
                {error && <p>{error}</p>}
            </form>
        </div>
     );
}
 
export default EmployeeSettings;