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
    console.log("Recieved request to get find an ingredient");
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