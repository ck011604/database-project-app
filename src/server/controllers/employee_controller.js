const pool = require("../pool")

exports.index = (req, res) => {
    console.log("Recieved request to get employees");
    // Query database for all employees
    pool.query("SELECT * FROM employees WHERE is_active = true", (error, results) => {
        if(error) {
            res.writeHead(500,{"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    success: false, message: "Server Error fetching employees",
                })
            );
            console.log("Error fetching employees", error);
            return;
        } // Else
        console.log("Successfully fetched employees");
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({success: true, employees: results}));
    });
}
exports.employee_detail = (req, res) => {
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
                    success: false, message: "Server Error fetching employee details",
                }));
            console.error("Error fetching employee details:", error);
            return;
        }
        if (results.length === 0) {
            // No employee is found with the given ID
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(JSON.stringify({success: false, message: "Employee not found"}));
            return;
        }
        // If the employee is found, return details
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, employee: results[0] }));
    });
}
exports.employee_create_post = (req, res) => {
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
                    console.log(error)
                    return;
                } // Else
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true}));
                console.log("Successfully added employee");
            }
        )
    });
}