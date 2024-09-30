const pool = require("../pool")

exports.index = (req, res) => { // Get list of all available shifts
    console.log("Recieved request to get all shifts");
    // Query database for all available shifts
    pool.query("SELECT * FROM shifts", (error, results) => {
    if (error) {
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(
            JSON.stringify({
                success: false, 
                message: "Server Error fetching shifts",
            })
        );
        console.log("Error fetching shifts", error);
        return;
    }
    console.log("Successfully fetched shifts");
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({success: true, shifts: results}))
    });
}

exports.shift_detail = (req, res) => { // Get info of a shift
    console.log("Recieved request to get find a shift");
    // Getting the ID from the URL
    const shiftID = req.url.split("/")[3];
    if (!shiftID) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Shift ID is required"}));
        return;
    }
    // Query database for shift with specified ID
    pool.query("SELECT * FROM shifts WHERE shift_ID = ?", [shiftID], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching shift details",
                })
            );
            console.error("Error fetching shift details:", error);
            return;
        }
        if (results.length === 0) {
            // No employee is found with the given ID
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                success: false,
                message: "Employee not found",
                })
            );
            return;
        }
        // If the employee is found, return details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, shift: results[0]}));
    });
}

exports.shift_create_post = (req, res) => { // Add a shift, make is_filled = TRUE
    console.log("Received request to add shift");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // Ensure required fields
        console.log("Body received:", body);
        const{shift_date, shift_start_time, shift_end_time, shift_name} = JSON.parse(body);
        if (!shift_date || !shift_start_time || !shift_end_time || !shift_name) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(
                JSON.stringify({
                    success: false,
                    message: "Missing required fields",
                })
            );
            return;
        }
        pool.query(
            // Insert employee into database
            "INSERT INTO shifts (shift_date, shift_start_time, shift_end_time, shift_name) VALUES(?, ?, ?, ?)",
            [shift_date, shift_start_time, shift_end_time, shift_name],
            (error, result) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "Server Error inserting into shifts"
                        })
                    );
                    console.log(error);
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
                console.log("Successfully added new shift");
            }
        )
    });
}

exports.shift_update_patch = (req, res) => { // Update shift details
    console.log("Received request to update shift");
    // Get ID from URL
    const shiftID = req.url.split("/")[3];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {shift_date, shift_start_time, shift_end_time, shift_name, is_filled } = JSON.parse(body);
        // Check if there are fields to update
        if (!shift_date && !shift_start_time && !shift_end_time && !shift_name && is_filled === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "No fields to update" }));
            return;
        }
        // Construct SQL query
        let query_string = "UPDATE shifts SET ";
        const params = [];
        // Query provided fields and add to params array (allows for single changes)
        if (shift_date) { query_string += "shift_date = ?, "; params.push(shift_date); }
        if (shift_start_time) { query_string += "shift_start_time = ?, "; params.push(shift_start_time); }
        if (shift_end_time) { query_string += "shift_end_time = ?, "; params.push(shift_end_time); }
        if (shift_name) { query_string += "shift_name = ?, "; params.push(shift_name); }
        if (is_filled !== undefined) { query_string += "is_filled = ? "; params.push(is_filled); }
        // Remove trailing comma and spaces in array
        // Specify which shift
        query_string = query_string.replace(/, $/, ' WHERE shift_id = ?');
        params.push(shiftID);
        // Query the string and params array
        pool.query(query_string, params, (error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server Error updating shift' }));
                console.error(error);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: "Shift updated successfully" }));
            console.log("Successfully updated shift");
        });
    });
}

exports.shift_delete = (req, res) => {
    // Get Shift ID from the URL
    const shiftId = req.url.split("/")[3];
    if (!shiftId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Shift ID is required" }));
        return;
    }
    
    // Soft delete the shift by setting is_filled to false
    pool.query("DELETE FROM shifts WHERE shift_id = ?", [shiftId], (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server Error deleting shift" }));
            console.error("Error deleting shift:", error);
            return;
        }
        if (result.affectedRows === 0) {
            // No shift was found with the given ID
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Shift not found" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Shift deleted successfully" }));
        console.log("Successfully deleted shift");
    });
}