const pool = require("../pool")
const url = require('url');

module.exports = {
    runBatchSales: async (req, res) => {
        console.log("BatchSales endpoint reached");
        const batchQuery = `
        INSERT INTO restaurant_sales (sales_date, total_sales, total_discounts, total_taxes, total_cash)
        SELECT
	        CAST(time AS DATE) AS sales_date,
            SUM(total) AS total_sales,
            SUM(discount_amount) AS total_discounts, 
            SUM(tax_amount) AS total_taxes,
            SUM(received_amount - change_amount) AS total_cash
        FROM orders
        WHERE time IS NOT NULL
        GROUP BY CAST(time AS DATE)
        ON DUPLICATE KEY UPDATE 
	        total_sales = VALUES(total_sales),
	        total_discounts = VALUES(total_discounts),
            total_taxes = VALUES(total_taxes),
            total_cash = VALUES(total_cash);
        `;
        try {
            pool.query(batchQuery);
            res.end(JSON.stringify({ 
                success: true, 
                message: "The query has been executed and sales reports are now ready to be ran."
            }));
        } catch (error) {
            console.error("Error executing the batch sales", error);
            res.end(JSON.stringify({ 
                success: false, 
                message: "Error executing the batch sales query."
            }));
        }
    },

    getSalesReport: async (req, res) => {
        console.log("Reached sales report query endpoint");
        const parsedUrl = url.parse(req.url, true);
        const { startDate, endDate } = parsedUrl.query;
        console.log(startDate, endDate);
        let params = [];
        if (startDate && endDate) {
            whereClause = 'WHERE sales_date BETWEEN ? AND ?';
            params = [startDate, endDate];
        }

        const query = `
        SELECT DATE(sales_date) AS sales_date, total_sales, total_cash, total_taxes, total_discounts
        FROM restaurant_sales
        ${whereClause};
        `;
        
        const bestEmployees = `
        SELECT employee_id, last_name, first_name, role, (SELECT SUM(total)
                                                          FROM orders
                                                          WHERE waiter_id = e.employee_id) AS total_sales
        FROM employees e
        WHERE (SELECT SUM(total)
        FROM orders
        WHERE waiter_id = e.employee_id) IS NOT NULL
        ORDER BY total_sales DESC
        LIMIT 5;
        `;
        
        pool.query(query, params, (error, salesData) => {
            if (error) {
                console.error('Error in report query:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching sales report data"
                }));
                return;
            }
    
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                salesData: salesData || []
            }));
        });
        pool.query(bestEmployees, (error, topEmployees) => {
            if (error) {
                console.error('Error in logs query:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error getting the top 5 employees"
                }));
                return;
            }
    
            res.end(JSON.stringify({ 
                success: true, 
                topEmployees: topEmployees || []
                
            }));
        });
        console.log("Query executed");
    }
};
