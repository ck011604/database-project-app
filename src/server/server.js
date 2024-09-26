const http = require('http');
const url = require('url');
const accountController = require('./controllers/account_controller');
const virtualRegisterController = require('./controllers/virtualRegister_controller');
const employee_controller = require("./controllers/employee_controller")
const shift_controller = require("./controllers/shift_controller")
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
            accountController.login(req, res);
        }
        if (req.url === "/create-account") {
            accountController.createUserAccount(req, res);
        }
        if (req.url === "/confirm-order") {
          virtualRegisterController.confirm_order(req, res);
        }
        if (req.url === "/api/employees") {
            employee_controller.employee_create_post(req, res);
        }
        if (req.url === "/api/shifts") {
            shift_controller.shift_create_post(req, res);
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
        if (req.url === ("/api/shifts")) {
            shift_controller.index(req, res);
        }
        if (req.url.startsWith ("/api/shifts/")) {
            shift_controller.shift_detail(req, res);
        }
    }
    if (req.method === "PATCH") {
        if (req.url.startsWith("/api/employees/")) {
            employee_controller.employee_update_patch(req, res);
        }
        if (req.url === "/subtract-inventory") {
            virtualRegisterController.subtract_inventory(req, res);
        }
        if (req.url.startsWith("/api/shifts/")) {
            shift_controller.shift_update_patch(req, res);
        }
    }
    if (req.method === "DELETE") {
        if (req.url.startsWith("/api/employees/")) {
            employee_controller.employee_delete(req, res);
        }
        if (req.url.startsWith("/api/shifts/")) {
            shift_controller.shift_delete(req, res);
        }
    }
});

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
