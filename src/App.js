import "./css/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccount />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;