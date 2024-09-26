const http = require('http');
const url = require('url');
const virtualRegisterController = require('./controllers/virtualRegister_controller');
const employee_controller = require("./controllers/employee_controller")
const pool = require("./pool") // put const pool = require("../pool") into controller files

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
          virtualRegisterController.confirm_order(req, res);
        }
        if (req.url === "/api/employees") {
            employee_controller.employee_create_post(req, res);
        }
    }
    if(req.method === "GET") {
        if (req.url === "/menu") {
            virtualRegisterController.menu(req, res);
        }
        if (req.url === "/inventory-stock") {
            virtualRegisterController.inventory_stock(req, res);
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
        if (req.url === "/subtract-inventory") {
            virtualRegisterController.subtract_inventory(req, res);
        }
    }
    if (req.method === "DELETE") {
        if (req.url.startsWith("/api/employees/")) {
            employee_controller.employee_delete(req, res);
        } 
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
