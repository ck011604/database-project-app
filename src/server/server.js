const http = require('http');
const url = require('url');
const employee_controller = require("./controllers/employee_controller")
const pool = require("./pool") // put const pool = require("../pool") into controller files
// const querystring = require('querystring');

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log("Creating Server");
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    if (req.method === "POST") {
        if (req.url === "/login") {
            console.log("Received Post and /login");
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { email, password } = JSON.parse(body);

                pool.query('SELECT * FROM logins WHERE email = ? AND password = ?', [email, password],
                    (error, results) => {
                        if (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Server Error fetching logins' }));
                            console.log('Server Error', error);
                            return;
                        }
                        if (results.length > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true }));
                            console.log('Correct Login');
                        }
                        else {
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
                            console.log("Invalid credentials");
                        }
                    }
                );
            });
        }
        if (req.url === "/create-account") {
            console.log("Received request to create account");
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { email, firstName, lastName, password } = JSON.parse(body);
                pool.query('INSERT INTO logins (email, firstName, lastName, password) VALUES (?, ?, ?, ?)',
                    [email, firstName, lastName, password],
                    (error, result) => {
                        if (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Server Error inserting into logins' }));
                            return;
                        } // Else
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                        console.log("Successfully created account");
                    }
                )
            });
        }
        if (req.url === "/confirm-order") {
          console.log("Received request to add order");
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            const { selectedItems, waiterID, tableNumber, customerID, subtotal, tax, tipPercent, tipAmount, total, receivedAmount, changeAmount } = JSON.parse(body);
            pool.query(
              "INSERT INTO orders (items, waiter_id, table_id, customer_id, subtotal, tip_percent, tip_amount, total, received_amount, change_amount, tax_amount) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
              [selectedItems, waiterID, tableNumber, customerID, subtotal, tipPercent, tipAmount, total, receivedAmount, changeAmount, tax],
              (error, result) => {
                if (error) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: "Server Error inserting into orders",
                    })
                  );
                  console.log(error)
                  return;
                } // Else
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
                console.log("Successfully added order");
              }
            );
          });
        }
        if (req.url === "/api/employees") {
            employee_controller.employee_create_post(req, res);
        }
    }
    if(req.method === "GET") {
        if (req.url === "/menu") {
            console.log("Received request to get menu")
            pool.query('SELECT * FROM menu ORDER BY price DESC', (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ success: false, message: 'Server Error fetching menu'}))
                    console.log("Error fetching menu")
                    return;
                } // Else
                console.log("Successfully fetched menu")
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, menu: results}));
            })
        }
        if (req.url === "/inventory-stock") {
          console.log("Received request to get inventory stock");
          pool.query("SELECT ingredient_id, name, amount FROM inventory", (error, results) => {
              if (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    message: "Server Error fetching inventory",
                  })
                );
                console.log("Error fetching inventory");
                return;
              } // Else
              console.log("Successfully fetched inventory");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true, inventory: results }));
            }
          );
        }
        if (req.url === "/api/employees") {
            employee_controller.index(req, res);
        }
        if (req.url.startsWith("/api/employees/")) {
            employee_controller.employee_detail(req, res);
        }
    }
    if (req.method === "PATCH") {
        if (req.url.startsWith("/api/employees/")) {
            employee_controller.employee_update_patch(req, res);
        }
    }
    if (req.method === "DELETE" && req.url.startsWith("/api/employees/")) {
        const employeeId = req.url.split("/")[3]; // Extract employee ID from the URL
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
})

server.listen(3001, () => {
    console.log('Server running on port 3001')
});

// Remember to end the pool when your application terminates
process.on('SIGINT', () => {
    pool.end(err => {
        if (err) {
            console.error('An error occurred while closing the database connection pool:', err);
        } else {
            console.log('Database connection pool closed.');
        }
        process.exit(err ? 1 : 0);
    });
});
