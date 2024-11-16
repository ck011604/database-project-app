const pool = require("../pool");
const url = require('url');


module.exports = {
    getOrders: (req,res) => {
        const parsedUrl = url.parse(req.url, true);
        const {startDate, endDate} = parsedUrl.query;
        let dateFilter = '';
        let params = [];

        if(startDate && endDate){
            console.log(`Start Date: ${startDate} and End Date: ${endDate}`);
            dateFilter = 'WHERE DATE(time) BETWEEN ? AND ?';
            params = [
                startDate,
                endDate
            ];
        }

        const query = `
            SELECT
                order_id,
                waiter_id,
                customer_id,
                time,
                subtotal,
                items,
                tip_percent,
                tip_amount,
                total,
                received_amount,
                change_amount,
                tax_amount,
                special_requests,
                promoCode_id,
                table_number,
                pointsEarned,
                discount_type,
                discount_amount,
                discount_percent,
                employees.first_name
            FROM orders
            INNER JOIN employees
            ON orders.waiter_id = employees.employee_id 
            ${dateFilter}
            ORDER BY time DESC
            LIMIT 500

        `;
        
        /*console.log('Executing query:', query, 'with params:', params);*/
        pool.query(query, params, (error, results) => {
            if (error) {
                console.error('Error in report query:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching customer orders data"
                }));
                console.log(`Error fetching orders ${error}`);
                return;
            }
            console.log("Successfully fetched orders");
            
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                orderData: results
            }));
        });
    },

    getOrdersByHours: (req, res) =>{
        const parsedUrl = url.parse(req.url, true);
        const {startDate, endDate} = parsedUrl.query;
        let dateFilter = '';
        let params = [];

        if(startDate && endDate){
            console.log(`Start Date: ${startDate} and End Date: ${endDate}`);
            dateFilter = 'WHERE DATE(time) BETWEEN ? AND ?';
            params = [
                startDate,
                endDate
            ];
        }

        const query = `
            SELECT HOUR(time) AS hour, COUNT(*) AS order_count
            FROM orders
            ${dateFilter}
            GROUP BY hour
            ORDER BY hour;
        `;

        pool.query(query, params, (error, results) => {
            if (error) {
                console.error('Error in report query:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching customer orders hours data"
                }));
                console.log(`Error fetching orders ${error}`);
                return;
            }
            console.log("Successfully fetched orders by hours");
            
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                orderDataHours: results
            }));
        });

    },

    getOrdersByDays: (req, res) =>{
        const parsedUrl = url.parse(req.url, true);
        const {startDate, endDate} = parsedUrl.query;
        let dateFilter = '';
        let params = [];

        if(startDate && endDate){
            console.log(`Start Date: ${startDate} and End Date: ${endDate}`);
            dateFilter = 'WHERE DATE(time) BETWEEN ? AND ?';
            params = [
                startDate,
                endDate
            ];
        }

        const query = `
            SELECT DAYNAME(time) AS day, COUNT(*) AS order_count
            FROM orders
            ${dateFilter}
            GROUP BY day
            ORDER BY day;
        `;

        pool.query(query, params, (error, results) => {
            if (error) {
                console.error('Error in report query:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching customer orders days data"
                }));
                console.log(`Error fetching orders ${error}`);
                return;
            }
            console.log("Successfully fetched orders by days");
            
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                orderDataDays: results
            }));
        });

    },

    getOrdersByMonths: (req, res) =>{
        const parsedUrl = url.parse(req.url, true);
        const {startDate, endDate} = parsedUrl.query;
        let dateFilter = '';
        let params = [];

        if(startDate && endDate){
            console.log(`Start Date: ${startDate} and End Date: ${endDate}`);
            dateFilter = 'WHERE DATE(time) BETWEEN ? AND ?';
            params = [
                startDate,
                endDate
            ];
        }
        
        const query = `
            SELECT MONTHNAME(time) AS month, COUNT(*) AS order_count
            FROM orders
            ${dateFilter}
            GROUP BY month
            ORDER BY month;
        `;

        pool.query(query, params, (error, results) => {
            if (error) {
                console.error('Error in report query:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching customer orders months data"
                }));
                console.log(`Error fetching orders ${error}`);
                return;
            }
            console.log("Successfully fetched orders by months");
            
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                orderDataMonths: results
            }));
        });

    }


    
}