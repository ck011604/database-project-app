const pool = require("../pool")

exports.index = (req, res) => {
    console.log("Recieved request to get all inventory");
   
    pool.query("SELECT * FROM inventory", (error, results) => {
    if (error) {
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(
            JSON.stringify({
                success: false, 
                message: "Server Error fetching inventory",
            })
        );
        console.log("Error fetching inventory", error);
        return;
    }
    console.log("Successfully fetched inventory");
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({success: true, inventory: results}))
    });
}

exports.inventory_detail = (req, res) => { // Get info of a shift
    // console.log("Recieved request to get an ingredient");
    // Getting the ID from the URL
    const ingredientId = req.url.split("/")[3];
    if (!ingredientId) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Ingredient ID is required"}));
        return;
    }
    // Query database for shift with specified ID
    pool.query("SELECT * FROM inventory WHERE ingredient_id = ?", [ingredientId], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching ingredient details",
                })
            );
            console.error("Error fetching ingredient details:", error);
            return;
        }
        if (results.length === 0) {
            // No ingredient is found with the given ID
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                success: false,
                message: "ingredient not found",
                })
            );
            return;
        }
        // If the shift is found, return details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, ingredient: results[0]}));
    });
}

exports.inventory_update_patch = (req, res) => {
    const id = req.url.split("/")[3];
    let body = "";
    req.on("data", function (chunk) {
        body += chunk;
    });
    req.on("end", function () {
        const { quantity, action_type } = JSON.parse(body);
        
        // First update the inventory quantity
        const updateQuery = `
            UPDATE inventory 
            SET quantity = quantity + ?
            WHERE ingredient_id = ?;
        `;

        // Then add a log entry
        const logQuery = `
            INSERT INTO inventory_logs 
            (ingredient_id, action_type, quantity_change, log_date, log_time)
            VALUES (?, ?, ?, CURDATE(), CURTIME())
        `;

        pool.query(updateQuery, [quantity, id], (error, results) => {
            if (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Error updating inventory"
                }));
                return;
            }

            // After updating inventory, log the action
            pool.query(logQuery, [id, action_type, quantity], (logError) => {
                if (logError) {
                    console.error("Error logging inventory change:", logError);
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: "Inventory updated successfully"
                }));
            });
        });
    });
}

exports.inventory_create_post = (req, res) => {

}