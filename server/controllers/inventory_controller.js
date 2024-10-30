const pool = require("../pool")

exports.index = (req, res) => {
    console.log("Received request to get all inventory");
   
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
        res.end(JSON.stringify({
            success: true, 
            inventory: results.map(item => ({
                ingredient_id: item.ingredient_id,
                name: item.name,
                amount: item.amount,
                quantity: item.amount,
                restock_threshold: item.restock_threshold,
                restock_amount: item.restock_amount
            }))
        }));
    });
}

exports.inventory_detail = (req, res) => {
    const ingredientId = req.url.split("/")[3];
    if (!ingredientId) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Ingredient ID is required"}));
        return;
    }

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
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                success: false,
                message: "Ingredient not found",
                })
            );
            return;
        }

        const ingredient = results[0];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
            success: true, 
            ingredient: {
                ...ingredient,
                quantity: ingredient.amount
            }
        }));
    });
}

exports.inventory_update_patch = (req, res) => {
    const id = req.url.split("/")[3];
    let body = "";
    
    req.on("data", function (chunk) {
        body += chunk;
    });

    req.on("end", function () {
        try {
            const { quantity, action_type } = JSON.parse(body);
            
            // Set the action type variable first
            pool.query("SET @action_type = ?", [action_type], (setError) => {
                if (setError) {
                    console.error("Set action type error:", setError);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ 
                        success: false, 
                        message: "Error setting action type"
                    }));
                    return;
                }

                // Then update the inventory
                const updateQuery = `
                    UPDATE inventory 
                    SET amount = GREATEST(0, amount + ?)
                    WHERE ingredient_id = ?
                `;

                pool.query(updateQuery, [quantity, id], (updateError, updateResults) => {
                    if (updateError) {
                        console.error("Update error:", updateError);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ 
                            success: false, 
                            message: "Error updating inventory"
                        }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: "Inventory updated successfully"
                    }));
                });
            });
        } catch (error) {
            console.error("Error processing request:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: false, 
                message: "Error processing request"
            }));
        }
    });
};