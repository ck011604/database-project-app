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
    }
}
