const pool = require("../pool")

exports.index = (req, res) => { // Get list of all employees
    console.log("Recieved request to get employees");
    // Query database for all employees
    pool.query("SELECT * FROM employees", (error, results) => {
        if(error) {
            res.writeHead(500,{"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    success: false, message: "Server Error fetching employees",
                })
            );
            console.log("Error fetching employees", error);
            return;
        }
        console.log("Successfully fetched employees");
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: true, employees: results}));
    });
}
exports.employee_detail = (req, res) => { // Get info of an employee
    console.log("Recieved request to get find an employee");
    // Getting the ID from the URL
    const employeeId = req.url.split("/")[3];
    if (!employeeId) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: false, message: "Employee ID is required"}));
        return;
    }
    // Query database for employee with specified ID
    pool.query("SELECT * FROM employees WHERE employee_id = ?", [employeeId], (error, results) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ 
                    success: false,
                    message: "Server Error fetching employee details",
                })
            );
            console.error("Error fetching employee details:", error);
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
        res.end(JSON.stringify({ success: true, employee: results[0]}));
    });
}
exports.employee_create_post = (req, res) => { // Add an employee to database
    // Create employee
    console.log("Received request to add employee");
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        // Check for missing fields
        console.log("Body received:", body);
        const{first_name, last_name, email, role} = JSON.parse(body);
        if (!first_name || !last_name || !email || !role === undefined) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: "Missing required fields"}));
            return;
        }
        pool.query(
            // Insert employee into database
            "INSERT INTO employees (first_name, last_name, email, role) VALUES(?, ?, ?, ?)",
            [first_name, last_name, email, role],
            (error, result) => {
                if (error) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "Server Error inserting into employees"
                        })
                    );
                    console.log(error);
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
                console.log("Successfully added employee");
            }
        )
    });
}
exports.employee_update_patch = (req, res) => { // Update employee details
    console.log("Received request to update employee");
    // Get ID from URL
    const employeeId = req.url.split("/")[3];

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {first_name, last_name, email, role, is_active } = JSON.parse(body);
        // Check if there are fields to update
        if (!first_name && !last_name && !email && !role && is_active === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: false, message: "No fields to update"}));
            return;
        }
        // Construct SQL query
        let query_string = "UPDATE employees SET ";
        const params = [];
        // Query provided fields and add to params array (allows for single changes)
        if (first_name) { query_string += "first_name = ?, "; params.push(first_name); }
        if (last_name) { query_string += "last_name = ?, "; params.push(last_name); }
        if (email) { query_string += "email = ?, "; params.push(email); }
        if (role) { query_string += "role = ?, "; params.push(role); }
        if (is_active !== undefined) { query_string += "is_active = ?, "; params.push(is_active); }
        // Remove trailing comma and spaces in array
        // Specify which employee
        query_string = query_string.replace(/, $/, ' WHERE employee_id = ?');
        // Include employee_ID to array for WHERE
        params.push(employeeId);
        // Query the string and params array
        pool.query(query_string, params, (error, result) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server Error updating employee' }));
                console.log(error);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            console.log("Successfully updated employee");
        });
    });
}
exports.employee_delete = (req, res) => {
    // Get employee ID from the URL
    const employeeId = req.url.split("/")[3];
    if (!employeeId) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Employee ID is required" }));
        return;
    }
    // Soft delete the employee by setting is_active to false
    pool.query("UPDATE employees SET is_active = false WHERE employee_id = ?", [employeeId], (error, result) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Server Error deleting employee" }));
            console.error("Error deleting employee:", error);
            return;
        }
        if (result.affectedRows === 0) {
            // No employee was found with the given ID
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Employee not found" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Employee deleted successfully" }));
        console.log("Successfully deleted employee");
    });
}