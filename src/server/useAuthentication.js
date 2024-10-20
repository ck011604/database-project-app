const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"]; // Get authorization header
    const token = authHeader && authHeader.split(" ")[1]; // Extract token

    if (!token) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Token required" }));
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Token invalid" }));
            return;
        }
        req.user = user; // Attach user info to request object
        next(); // Call the next middleware or function
    });
};

module.exports = authMiddleware;
