const pool = require("../pool")

exports.employee_detail = (req, res) => {
    console.log("Recieved request to get find an employee");
    const recipeID = req.url.split("/")[3];
    if (!recipeID) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Recipe ID is required"}));
        return;
    }
    // Query database for item with specified ID
    pool.query("SELECT * FROM menu WHERE recipe_id = ?", [recipeID], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false,
                    message: "Server Error fetching item details",
                })
            );
            console.error("Error fetching item details:", error);
            return;
        }
        if (results.length === 0) {
            // No item is found with the given ID
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    success: false,
                    message: "Item not found",
                })
            );
            return;
        }
        // If the item is found, return details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, employee: results[0]}));
    });
}
exports.menu_create_post = (req, res) => {
    console.log("Received request to add menu item");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // Ensure required fields
        console.log("Body received:", body);
        const{name, ingredients, price, type} = JSON.parse(body);
        if (!name || !ingredients || !price || !type) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(
                JSON.stringify({
                    success: false,
                    message: "Missing required fields",
                })
            );
            return;
        }
        const ingredientsJson = JSON.stringify(ingredients);
        pool.query(
            // Insert menu item into database
            "INSERT INTO menu (name, ingredients, price, type, image) VALUES (?, ?, ?, ?, ?)",
            [name, JSON.stringify(ingredients), price, type, ""],
            (error, result) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "Server Error inserting into menu"
                        })
                    );
                    console.log(error);
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
                console.log("Successfully added new menu item");
            }
        )
    });
}

exports.menu_update_patch = (req, res) => {
    console.log("Received request to update menu item");
    // Get ID from URL
    const menuID = req.url.split("/")[3];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {recipe_id, name, ingredients, price, image, type, is_active} = JSON.parse(body);
        // Check if there are fields to update
        if (!recipe_id && !name && !ingredients && !price && !image && !type && is_active === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "No fields to update" }));
            return;
        }
        // Construct SQL query
        let query_string = "UPDATE menu SET ";
        const params = [];
        // Query provided fields and add to params array (allows for single changes)
        if (recipe_id) { query_string += "recipe_id = ?, "; params.push(recipe_id); }
        if (name) { query_string += "name = ?, "; params.push(name); }
        if (ingredients) { query_string += "ingredients = ?, "; params.push(JSON.stringify(ingredients)); }
        if (price) { query_string += "price = ?, "; params.push(price); }
        if (image) { query_string += "image = ?, "; params.push(image); }
        if (type) { query_string += "type = ?, "; params.push(type); }
        if (is_active !== undefined) { query_string += "is_active = ? "; params.push(is_active); }
        // Remove trailing comma and spaces in array
        // Specify which menu item
        query_string = query_string.replace(/, $/, ' WHERE recipe_id = ?');
        params.push(menuID);
        // Query the string and params array
        pool.query(query_string, params, (error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server Error updating menu' }));
                console.error(error);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: "Menu updated successfully" }));
            console.log("Successfully updated menu");
        });
    });
}

exports.menu_delete = (req, res) => {
    // Get recipe ID from the URL
    const recipeID = req.url.split("/")[3];
    if (!recipeID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Recipe ID is required" }));
        return;
    }
    // Soft delete the recipe by setting is_active to false
    pool.query("UPDATE menu SET is_active = false WHERE recipe_id = ?", [recipeID], (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server Error deleting recipe" }));
            console.error("Error deleting recipe]:", error);
            return;
        }
        if (result.affectedRows === 0) {
            // No recipe was found with the given ID
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Recipe not found" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Recipe deleted successfully" }));
        console.log("Successfully deleted recipe");
    });
}