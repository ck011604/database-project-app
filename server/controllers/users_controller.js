const pool = require("../pool")

exports.user_detail = (req, res) => {
    console.log("Received request for user details")
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

exports.user_update_patch = (req, res) => { // Update user details
    console.log("Received request to update customer");
    // Get ID from URL
    const customerId = req.url.split("/")[3];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {first_name, last_name, email, password } = JSON.parse(body);
        // Check if there are fields to update
        if (!first_name && !last_name && !email && !password  === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: false, message: "No fields to update"}));
            return;
        }
        // Construct SQL query
        let query_string = "UPDATE users SET ";
        const params = [];
        // Query provided fields and add to params array (allows for single changes)
        if (first_name) { query_string += "first_name = ?, "; params.push(first_name); }
        if (last_name) { query_string += "last_name = ?, "; params.push(last_name); }
        if (email) { query_string += "email = ?, "; params.push(email); }
        if (password) { query_string += "password = ?, "; params.push(password);}
        // Remove trailing comma and spaces in array
        // Specify which customer
        query_string = query_string.replace(/, $/, ' WHERE user_id = ?');
        // Include customer_ID to array for WHERE
        params.push(customerId);
        // Query the string and params array
        pool.query(query_string, params, (error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server Error updating customer' }));
                console.log(error);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            console.log("Successfully updated customer");
        });
    });
}