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
        const { reportType, startDate, endDate } = parsedUrl.query;
        let query = '';
        let params = [];
        if (reportType === "Daily") {
            query = `
            SELECT sales_date, total_sales, total_cash, total_taxes, total_discounts
            FROM restaurant_sales
            WHERE sales_date = '${startDate}';
            `;
            params = [startDate];

        } else if (reportType === "Monthly" || reportType === "Yearly") {
            query = `
            SELECT sales_date, total_sales, total_cash, total_taxes, total_discounts
            FROM restaurant_sales
            WHERE sales_date BETWEEN '${startDate}' AND '${endDate}';
            `;
            params = [startDate, endDate];
        } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({
                success: false,
                message: "Error in executing the sales report query, please check the dates selected and try again."
            }));
        }
        const bestEmployees = `
        SELECT employee_id, last_name, first_name, role, (SELECT SUM(total)
                                                          FROM orders
                                                          WHERE waiter_id = e.employee_id) AS total_sales
        FROM employees e
        WHERE (SELECT SUM(total)
        FROM orders
        WHERE waiter_id = e.employee_id) IS NOT NULL
        ORDER BY total_sales DESC
        LIMIT 3;
        `;
        
        try {
            const [salesData] = pool.query(query, params);
            const [topEmployees] = pool.query(bestEmployees);
            console.log("Query executed");

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                success: true,
                salesData: salesData,
                topEmployees: topEmployees,
                message: "SUCCESS."
            }));
        } catch (error) {
            console.log("Error fetching report");
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                success: false,
                message: `Failed to fetch the report.`
            }));
        }
    }
};
