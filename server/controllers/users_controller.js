const pool = require("../pool")

exports.user_detail = (req, res) => {
    const userID = req.url.split("/")[3];
    if (!userID) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "User ID is required"}));
        return;
    }
    pool.query("SELECT * FROM users WHERE user_id = ?", [userID], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false,
                    message: "Server Error fetching user details",
                })
            );
            console.error("Error fetching user details:", error);
            return;
        }
        if (results.length === 0) {
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                })
            );
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, user: results[0]}));
    });
}