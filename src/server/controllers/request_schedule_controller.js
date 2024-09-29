const pool = require("../pool")

exports.index = (req, res) => { // Get list of all time-off/ schedule change requests
    console.log("Recieved request to get all requests");
    // Query database for all requests
    pool.query("SELECT * FROM request_schedule", (error, results) => {
    if (error) {
        res.writeHead(500, {"Content-Type": "application/json"});
        res.end(
            JSON.stringify({
                success: false, 
                message: "Server Error fetching requests",
            })
        );
        console.log("Error fetching requests", error);
        return;
    }
    console.log("Successfully fetched requests");
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({success: true, requests: results}))
    });
}

exports.request_schedule_detail = (req, res) => {
    console.log("Recieved request to get find requests");
    // Getting the ID from the URL
    const requestID = req.url.split("/")[3];
    if (!requestID) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Request ID is required"}));
        return;
    }
    // Query database for schedule with specified ID
    pool.query("SELECT * FROM request_schedule WHERE request_id = ?", [requestID], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching request details",
                })
            );
            console.error("Error fetching request details:", error);
            return;
        }
        if (results.length === 0) {
            // No request is found with the given ID
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                success: false,
                message: "Request not found",
                })
            );
            return;
        }
        // If the request is found, return details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, request_schedule: results[0]}));
    });
}

exports.request_schedule_create_post = (req, res) => {
    console.log("Received request to add schedule request");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // Ensure required fields
        console.log("Body received:", body);
        const{employee_id, request_type, request_start_date, request_end_date, status, submitted_at} = JSON.parse(body);
        if (!employee_id || !request_type || !request_start_date || !request_end_date || !status ||!submitted_at) {
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
            // Insert request into database
            "INSERT INTO request_schedule (employee_id, request_type, request_start_date, request_end_date, status, submitted_at) VALUES(?, ?, ?, ?, ?, ?)",
            [employee_id, request_type, request_start_date, request_end_date, status, submitted_at],
            (error, result) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "Server Error inserting into request_schedule"
                        })
                    );
                    console.log(error);
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
                console.log("Successfully added new request");
            }
        )
    });
}

exports.request_schedule_update_patch = (req, res) => {
    console.log("Received request to update request schedule");
    // Get ID from URL
    const requestID = req.url.split("/")[3];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {request_id, employee_id, request_type, request_start_date, request_end_date, status, submitted_at, is_active} = JSON.parse(body);
        // Check if there are fields to update
        if (!request_id && !employee_id && !request_type && !request_start_date && !request_end_date && !status && !submitted_at && is_active === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "No fields to update" }));
            return;
        }
        // Construct SQL query
        let query_string = "UPDATE request_schedule SET ";
        const params = [];
        // Query provided fields and add to params array (allows for single changes)
        if (request_id) { query_string += "schedule_id = ?, "; params.push(request_id); }
        if (employee_id) { query_string += "employee_id = ?, "; params.push(employee_id); }
        if (request_type) { query_string += "shift_id = ?, "; params.push(request_type); }
        if (request_start_date) { query_string += "schedule_date = ?, "; params.push(request_start_date); }
        if (request_end_date) { query_string += "schedule_date = ?, "; params.push(request_end_date); }
        if (status) { query_string += "schedule_date = ?, "; params.push(status); }
        if (submitted_at) { query_string += "schedule_date = ?, "; params.push(submitted_at); }
        if (is_active !== undefined) { query_string += "is_active = ? "; params.push(is_active); }
        // Remove trailing comma and spaces in array
        // Specify which schedule
        query_string = query_string.replace(/, $/, ' WHERE request_id = ?');
        params.push(requestID);
        // Query the string and params array
        pool.query(query_string, params, (error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server Error updating schedule request' }));
                console.error(error);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: "Request updated successfully" }));
            console.log("Successfully updated request");
        });
    });
}

exports.request_schedule_delete = (req, res) => {
    // Get schedule ID from the URL
    const requestID = req.url.split("/")[3];
    if (!requestID) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Request ID is required" }));
        return;
    }
    
    // Soft delete the request by setting is_active to false
    pool.query("DELETE FROM request_schedule WHERE request_id = ?", [requestID], (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server Error deleting request" }));
            console.error("Error deleting request:", error);
            return;
        }
        if (result.affectedRows === 0) {
            // No request was found with the given ID
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Request not found" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Request deleted successfully" }));
        console.log("Successfully deleted request");
    });
}