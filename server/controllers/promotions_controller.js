const pool = require("../pool")

exports.index = (req, res) => {
    console.log("Recieved request to get promotions");
    // Query database for all promotions
    pool.query("SELECT * FROM promotion_codes", (error, results) => {
        if(error) {
            res.writeHead(500,{"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    success: false, message: "Server Error fetching promotions",
                })
            );
            console.log("Error fetching promotions", error);
            return;
        }
        console.log("Successfully fetched promotions");
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: true, promotions: results}));
    });
}
exports.promotion_detail = (req, res) => { // Get info of a promotion
    console.log("Recieved request to get find a promotion");
    // Getting the ID from the URL
    const promoID = req.url.split("/")[3];
    if (!promoID) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Promotion ID is required"}));
        return;
    }
    // Query database for promotion with specified ID
    pool.query("SELECT * FROM promotion_codes WHERE promoCode_id = ?", [promoID], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false,
                    message: "Server Error fetching promotion details",
                })
            );
            console.error("Error fetching promotion details:", error);
            return;
        }
        if (results.length === 0) {
            // No promotion is found with the given ID
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    success: false,
                    message: "Promotion not found",
                })
            );
            return;
        }
        // If the promotion is found, return details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, promotion: results[0]}));
    });
}
exports.promotion_create_post = (req, res) => { // Add a promotion to database
    // Create promotion
    console.log("Received request to add promotion");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // Check for missing fields
        console.log("Body received:", body);
        const{code, discount_percent, uses_left} = JSON.parse(body);
        if (!code || !discount_percent || !uses_left === undefined) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: "Missing required fields"}));
            return;
        }
        pool.query(
            // Insert promotion into database
            "INSERT INTO promotion_codes (code, discount_percent, uses_left) VALUES(?, ?, ?)",
            [code, discount_percent, uses_left],
            (error, result) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "Server Error inserting into promotion_codes"
                        })
                    );
                    console.log(error);
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
                console.log("Successfully added promotion");
            }
        )
    });
}
exports.promotion_update_patch = (req, res) => { // Update promotion details
    console.log("Received request to update promotion");
    // Get ID from URL
    const promoID = req.url.split("/")[3];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {code, discount_percent, uses_left, is_active } = JSON.parse(body);
        // Check if there are fields to update
        if (!code && !discount_percent && !uses_left && is_active === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: false, message: "No fields to update"}));
            return;
        }
        // Construct SQL query
        let query_string = "UPDATE promotion_codes SET ";
        const params = [];
        // Query provided fields and add to params array (allows for single changes)
        if (code) { query_string += "code = ?, "; params.push(code); }
        if (discount_percent) { query_string += "discount_percent = ?, "; params.push(discount_percent); }
        if (uses_left) { query_string += "uses_left = ?, "; params.push(uses_left); }
        if (is_active !== undefined) { query_string += "is_active = ?, "; params.push(is_active); }
        // Remove trailing comma and spaces in array
        // Specify which promotion
        query_string = query_string.replace(/, $/, ' WHERE promoCode_id = ?');
        // Include promotion_ID to array for WHERE
        params.push(promoID);
        // Query the string and params array
        pool.query(query_string, params, (error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server Error updating promotion' }));
                console.log(error);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            console.log("Successfully updated promotion");
        });
    });
}
exports.promotion_delete = (req, res) => {
    // Get promotion ID from the URL
    const promoID = req.url.split("/")[3];
    if (!promoID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Promotion ID is required" }));
        return;
    }
    // Soft delete the promotion by setting is_active to false
    pool.query("UPDATE promotion_codes SET is_active = false WHERE promoCode_id = ?", [promoID], (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server Error deleting promotion" }));
            console.error("Error deleting promotion:", error);
            return;
        }
        if (result.affectedRows === 0) {
            // No promotion was found with the given ID
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Promotion not found" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Promotion deleted successfully" }));
        console.log("Successfully deleted promotion");
    });
}
