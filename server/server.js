const env_dir = __dirname + `/../.env`
require('dotenv').config({ path: env_dir });
const http = require('http');
const https = require('https');
const accountController = require('./controllers/account_controller');
const virtualRegisterController = require('./controllers/virtualRegister_controller');
const promotionalCodeController = require('./controllers/promotional_code_controller');
const employee_controller = require("./controllers/employee_controller");
const shift_controller = require("./controllers/shift_controller");
const inventory_controller = require("./controllers/inventory_controller");
const menu_management_controller = require("./controllers/menu_management_controller");
const promotions_controller = require("./controllers/promotions_controller.js");
const request_schedule_controller = require("./controllers/request_schedule_controller");
const inventory_report_controller = require("./controllers/inventory_report_controller");
const sales_report_controller = require('./controllers/sales_report_controller');
const staticController = require('./controllers/static_controller');
const pool = require("./pool") // put const pool = require("../pool") into controller files
const fs = require("fs")
const https_mode = fs.existsSync(process.env.PATH_TO_CERT) && fs.existsSync(process.env.PATH_TO_KEY)
const port = https_mode ? 443 : 3001

const serverBlock = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
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
        if (req.url === "/api/menu_management") {
            menu_management_controller.menu_create_post(req, res);
        }
        if (req.url === "/api/request_schedule") {
            request_schedule_controller.request_schedule_create_post(req, res);
        }
        if (req.url === "/api/inventory") {
            inventory_controller.inventory_create_post(req, res);
        }
        if (req.url === "/api/inventory-logs") {
            inventory_controller.create_inventory_log(req, res);
        }
        if (req.url === "/api/menu_image") {
            menu_management_controller.menu_image_upload(req, res);
        }
        if (req.url === "/api/batch-sales") {
            sales_report_controller.runBatchSales(req, res);
        }
        if (req.url === "/api/promotions") {
            promotions_controller.promotion_create_post(req, res);
        }
    }
    if(req.method === "GET") {
        if (req.url.startsWith("/static")) {
            staticController.serve(req, res)
        }
        if (req.url === "/menu") {
            virtualRegisterController.menu(req, res);
        }
        if (req.url === "/inventory-stock") {
            virtualRegisterController.inventory_stock(req, res);
        }
        if (req.url.startsWith("/check-promo-code")) {
            promotionalCodeController.check_promo_code(req, res);
        }
        if (req.url.startsWith("/valid-customer-email")) {
          accountController.validCustomerEmail(req, res);
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
        if (req.url.startsWith ("/api/request_schedule/")) {
            request_schedule_controller.request_schedule_detail(req, res);
        }
        if (req.url.startsWith("/api/inventory-report/logs")) {
            inventory_report_controller.getInventoryLogs(req, res);
        } else if (req.url.startsWith("/api/inventory-report/stats")) {
            inventory_report_controller.getStats(req, res);
        }
        if (req.url === "/api/inventory") {
            inventory_controller.index(req, res);
        }
        if (req.url.startsWith("/api/inventory/")) {
            inventory_controller.inventory_detail(req, res);
        }
        if (req.url === "/api/menu_management") {
            menu_management_controller.menu(req, res);
        }
        if (req.url.startsWith("/api/menu_management/")) {
            menu_management_controller.menu_detail(req, res);
        }
        if (req.url.startsWith("/api/sales-report")) {
            sales_report_controller.getSalesReport(req, res);
        }
        if (req.url.startsWith("/api/empsales-report")) {
            sales_report_controller.getTopEmployees(req, res);
        }
        if (req.url === "/api/promotions") {
            promotions_controller.index(req, res);
        }
        if (req.url.startsWith("/api/promotions/")) {
            promotions_controller.promotion_detail(req, res);
        }
    }
    if (req.method === "PATCH") {
        if (req.url.startsWith("/api/employees/")) {
            employee_controller.employee_update_patch(req, res);
        }
        if (req.url.startsWith("/api/shifts/")) {
            shift_controller.shift_update_patch(req, res);
        }
        if (req.url.startsWith("/api/menu_management/")) {
            menu_management_controller.menu_update_patch(req, res);
        }
        if (req.url.startsWith("/api/request_schedule/")) {
            request_schedule_controller.request_schedule_update_patch(req, res);
        }
        if (req.url.startsWith("/api/inventory/")) {
            inventory_controller.inventory_update_patch(req, res);
        }
        if (req.url.startsWith("/api/ingredient/")) {
            inventory_controller.ingredient_update_patch(req, res);
        }
        if (req.url.startsWith("/api/promotions/")) {
            promotions_controller.promotion_update_patch(req, res);
        }
    }
    if (req.method === "DELETE") {
        if (req.url.startsWith("/api/employees/")) {
            employee_controller.employee_delete(req, res);
        }
        if (req.url.startsWith("/api/shifts/")) {
            shift_controller.shift_delete(req, res);
        }
        if (req.url.startsWith("/api/menu_management/")) {
            menu_management_controller.menu_delete(req, res);
        }
        if (req.url.startsWith("/api/request_schedule/")) {
            request_schedule_controller.request_schedule_delete(req, res);
        }
        if (req.url.startsWith("/api/promotions/")) {
            promotions_controller.promotion_delete(req, res);
        }
    }
}

let server;
if(https_mode){
    const options = {
        cert: fs.readFileSync(process.env.PATH_TO_CERT),
        key: fs.readFileSync(process.env.PATH_TO_KEY)
    }
    server = https.createServer(options, serverBlock);
}
else{
    server = http.createServer(serverBlock);
}

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
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