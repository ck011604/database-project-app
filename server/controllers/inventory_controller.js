const pool = require("../pool")

exports.index = async (req, res) => {
    console.log("Received request to get all inventory");
    const promisePool = pool.promise();
    let results;
    try{
        const [rows, fields] = await promisePool.query("SELECT * FROM inventory")
        results = rows
    }catch(error){
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
    let ingredients = []
    try{
        for(let ingredient of results){
            let param = `%"ingredient_id": ${ingredient.ingredient_id}}%`
            const [rows, fields] = await promisePool.query("select 1 from menu where ingredients like ?", param)
            ingredients.push({
                ingredient_id: ingredient.ingredient_id,
                name: ingredient.name,
                amount: ingredient.amount,
                quantity: ingredient.amount,
                restock_threshold: ingredient.restock_threshold,
                restock_amount: ingredient.restock_amount,
                autoRestock: ingredient.autoRestock,
                is_active: ingredient.is_active,
                can_delete: rows.length == 0
            })
        }
    }catch(error){
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
        inventory: ingredients
    }))
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

exports.inventory_create_post = (req, res) => {
    console.log("Received request to create an ingredient");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // Check for missing fields
        console.log("Body received:", body);
        const{name, amount, restock_threshold, restock_amount} = JSON.parse(body);
        if (!name || !amount || !restock_threshold || !restock_amount === undefined) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: "Missing required fields"}));
            return;
        }
        pool.query(
            "INSERT INTO inventory (name, amount, restock_threshold, restock_amount) VALUES(?, ?, ?, ?)",
            [name, amount, restock_threshold, restock_amount],
            (error, result) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "Server Error inserting into inventory"
                        })
                    );
                    console.log(error);
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
                console.log("Successfully added ingredient into inventory");
            }
        )
    });
}

exports.ingredient_update_patch = (req, res) => { // Update ingredient details
    console.log("Received request to update ingredient");
    // Get ID from URL
    const ingredientID = req.url.split("/")[3];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { name, amount, restock_threshold, restock_amount, autoRestock, is_active} = JSON.parse(body);
        // Check if there are fields to update
        if (!name && !amount && !restock_threshold && !restock_amount && autoRestock === undefined && is_active === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: false, message: "No fields to update"}));
            return;
        }
        // Construct SQL query
        let query_string = "UPDATE inventory SET ";
        const params = [];
        // Query provided fields and add to params array (allows for single changes)
        if (name) { query_string += "name = ?, "; params.push(name); }
        if (amount) { query_string += "amount = ?, "; params.push(amount); }
        if (restock_threshold) { query_string += "restock_threshold = ?, "; params.push(restock_threshold); }
        if (restock_amount) { query_string += "restock_amount = ?, "; params.push(restock_amount); }
        if (autoRestock !== undefined) { query_string += "autoRestock = ?, "; params.push(autoRestock); }
        if (is_active !== undefined) { query_string += "is_active = ?, "; params.push(is_active); }
        // Remove trailing comma and spaces in array
        // Specify which ingredient
        query_string = query_string.replace(/, $/, ' WHERE ingredient_id = ?');
        params.push(ingredientID);
        // Query the string and params array
        pool.query(query_string, params, (error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server Error updating inventory' }));
                console.log(error);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            console.log("Successfully updated inventory");
        });
    });
}

exports.ingredient_delete = (req, res) => {
    const ingredientID = req.url.split("/")[3];
    if (!ingredientID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "ingredient ID is required" }));
        return;
    }
    pool.query("UPDATE inventory SET is_active = false WHERE ingredient_id = ?", [ingredientID], (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server Error deleting ingredient" }));
            console.error("Error deleting ingredient:", error);
            return;
        }
        if (result.affectedRows === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "ingredient not found" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "ingredient deleted successfully" }));
        console.log("Successfully deleted ingredient");
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
