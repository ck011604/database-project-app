import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../css/CustomerSettings.css";

const CustomerSettings = () => {
  const [oldEmail, setOldEmail] = useState("");
  const [oldFirstName, setOldFirstName] = useState("");
  const [oldLastName, setOldLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [inputOldPassword, setInputOldPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState("");
  const [lockCustSetting, setLockCustSetting] = useState(false);

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  let customerID = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      customerID = decodedToken.user_id;
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  }

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const customerResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${customerID}`)
        const customer = customerResponse.data.user;
        if (customerResponse.data.success) {
          setOldEmail(customer.email);
          setOldFirstName(customer.first_name);
          setOldLastName(customer.last_name);
          setOldPassword(customer.password);
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message)
          setError(err.response.data.message);
        else setError("An error has occured loading customer data");
      }
    };
    loadCustomerData();
    setError("");
  }, []);
  const handleSaveChangeCustomer = async (e) => {
    e.preventDefault();
    if (newPassword.length > 0 && newPassword != newPassword2) {
      setError("New Password doesn't match");
      return;
    } else if (oldPassword === inputOldPassword) {
      setLockCustSetting(true);
      try {
        // Convert new information into JSON
        let data = {};
        if (newFirstName !== "") {
          data["first_name"] = newFirstName;
        }
        if (newLastName !== "") {
          data["last_name"] = newLastName;
        }
        if (newEmail !== "") {
          data["email"] = newEmail;
        }
        if (newPassword !== "") {
          data["password"] = newPassword;
        }

        let customerResponse = await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/user/${customerID}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (customerResponse.data.success) {
          console.log("Updated user info");
          sessionStorage.removeItem("token");
          navigate("/login", {
            replace: true,
            state: {
              email: newEmail !== "" ? newEmail : oldEmail,
              message: "Updated Account Info!",
            },
          });
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message)
          setError(err.response.data.message);
        else setError("An error has updating customer data");
      }
    }
  };

  return (
    <div className="customer-setting-container">
      <div className="customer-settings">
        <h1>Settings</h1>
        <form onSubmit={handleSaveChangeCustomer}>
          <div className="input-field">
            <label>First Name: </label>
            <input
              type="text"
              value={newFirstName}
              onChange={(e) => {
                setNewFirstName(e.target.value);
              }}
              placeholder={oldFirstName}
              disabled={lockCustSetting}
            />
          </div>
          <div className="input-field">
            <label>Last Name: </label>
            <input
              type="text"
              value={newLastName}
              onChange={(e) => {
                setNewLastName(e.target.value);
              }}
              placeholder={oldLastName}
              disabled={lockCustSetting}
            />
          </div>
          <div className="input-field">
            <label>Email: </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
              placeholder={oldEmail}
              disabled={lockCustSetting}
            />
          </div>
          <div className="input-field">
            <label>New Password: </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              placeholder="Enter new password"
              disabled={lockCustSetting}
            />
          </div>
          {newPassword.length > 0 && (
            <div className="input-field">
              <label>Confirm New Password: </label>
              <input
                type="password"
                value={newPassword2}
                onChange={(e) => {
                  setNewPassword2(e.target.value);
                }}
                placeholder="Must be the same as above"
                disabled={lockCustSetting}
              />
            </div>
          )}
          {(newFirstName !== "" ||
            newLastName !== "" ||
            newPassword !== "" ||
            newEmail !== "") && (
            <div className="input-field">
              <label>Old Password: </label>
              <input
                type="password"
                value={inputOldPassword}
                onChange={(e) => {
                  setInputOldPassword(e.target.value);
                }}
                placeholder="Password Verification"
                disabled={lockCustSetting}
                required
              />
            </div>
          )}
          <button
            className="edit-customer-button"
            disabled={
              lockCustSetting ||
              (newFirstName === "" &&
                newLastName === "" &&
                newPassword === "" &&
                newEmail === "")
            }
          >
            Save Changes
          </button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CustomerSettings;