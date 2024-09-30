const pool = require("../pool")

exports.index = (req, res) => { // Get list of all available schedules
    console.log("Recieved request to get all schedules");
    // Query database for all schedules
    pool.query("SELECT * FROM schedule", (error, results) => {
    if (error) {
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(
            JSON.stringify({
                success: false, 
                message: "Server Error fetching schedules",
            })
        );
        console.log("Error fetching schedules", error);
        return;
    }
    console.log("Successfully fetched schedules");
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({success: true, schedule: results}))
    });
}

exports.schedule_detail = (req, res) => {
    console.log("Recieved request to get find schedule");
    // Getting the ID from the URL
    const scheduleID = req.url.split("/")[3];
    if (!scheduleID) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Schedule ID is required"}));
        return;
    }
    // Query database for schedule with specified ID
    pool.query("SELECT * FROM schedule WHERE schedule_id = ?", [scheduleID], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching schedule details",
                })
            );
            console.error("Error fetching schedule details:", error);
            return;
        }
        if (results.length === 0) {
            // No schedule is found with the given ID
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                success: false,
                message: "Employee not found",
                })
            );
            return;
        }
        // If the schedule is found, return details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, schedule: results[0]}));
    });
}

exports.schedule_create_post = (req, res) => {
    console.log("Received request to add schedule");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // Ensure required fields
        console.log("Body received:", body);
        const{employee_id, shift_id} = JSON.parse(body);
        if (!employee_id || !shift_id) {
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
            // Insert schedule into database
            "INSERT INTO schedule (employee_id, shift_id) VALUES(?, ?)",
            [employee_id, shift_id],
            (error, result) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "Server Error inserting into schedule"
                        })
                    );
                    console.log(error);
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
                console.log("Successfully added new schedule");
            }
        )
    });
}

exports.schedule_update_patch = (req, res) => {
    console.log("Received request to update schedule");
    // Get ID from URL
    const scheduleID = req.url.split("/")[3];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {schedule_id, employee_id, shift_id, schedule_date, is_active } = JSON.parse(body);
        // Check if there are fields to update
        if (!schedule_id && !employee_id && !shift_id && !schedule_date && is_active === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "No fields to update" }));
            return;
        }
        // Construct SQL query
        let query_string = "UPDATE schedule SET ";
        const params = [];
        // Query provided fields and add to params array (allows for single changes)
        if (schedule_id) { query_string += "schedule_id = ?, "; params.push(schedule_id); }
        if (employee_id) { query_string += "employee_id = ?, "; params.push(employee_id); }
        if (shift_id) { query_string += "shift_id = ?, "; params.push(shift_id); }
        if (schedule_date) { query_string += "schedule_date = ?, "; params.push(schedule_date); }
        if (is_active !== undefined) { query_string += "is_active = ? "; params.push(is_active); }
        // Remove trailing comma and spaces in array
        // Specify which schedule
        query_string = query_string.replace(/, $/, ' WHERE schedule_id = ?');
        params.push(scheduleID);
        // Query the string and params array
        pool.query(query_string, params, (error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server Error updating schedule' }));
                console.error(error);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: "Shift updated successfully" }));
            console.log("Successfully updated schedule");
        });
    });
}

exports.schedule_delete = (req, res) => {
    // Get schedule ID from the URL
    const scheduleID = req.url.split("/")[3];
    if (!scheduleID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Schedule ID is required" }));
        return;
    }
    
    // Soft delete the schedule by setting is_active to false
    pool.query("DELETE FROM schedule WHERE schedule_id = ?", [scheduleID], (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server Error deleting schedule" }));
            console.error("Error deleting schedule:", error);
            return;
        }
        if (result.affectedRows === 0) {
            // No schedule was found with the given ID
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Schedule not found" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Schedule deleted successfully" }));
        console.log("Successfully deleted schedule");
    });
}