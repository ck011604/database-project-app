const pool = require("../pool")
const url = require('url');

module.exports = {
    getEmployeeOrderData: async (req, res) => {
        console.log("get employee - order table data endpoint reached");
        const employeeOrderQuery = `
        SELECT
            e.employee_id,
            e.first_name,
            e.last_name,
            o.order_id,
            o.tip_amount,
            o.subtotal,
            o.discount_amount,
            (o.tip_amount + o.subtotal - o.discount_amount) AS order_total
        FROM employees e
        JOIN orders o ON e.employee_id = o.waiter_id
        ORDER BY e.employee_id, o.order_id
        LIMIT 500;
        `;
        
        pool.query(employeeOrderQuery, (error, tableData) => {
            if (error) {
                console.error('Error in report query:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching employee - orders table data"
                }));
                return;
            }
    
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                tableData: tableData || []
            }));
        });
    },

    getTopEmployees: async (req, res) => {
        console.log("Reached Top Employees query");
        const bestEmployees = `
        SELECT 
            employee_id, 
            last_name, 
            first_name, 
            role, 
            (SELECT SUM(tip_amount)
            FROM orders
            WHERE waiter_id = e.employee_id) AS total_tips,
            (SELECT COUNT(order_id)
            FROM orders
            WHERE waiter_id = e.employee_id) AS orders_count
        FROM employees e
        WHERE (SELECT SUM(total)
               FROM orders
               WHERE waiter_id = e.employee_id) IS NOT NULL 
        ORDER BY total_tips DESC;
        `;
        
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
        console.log("Top Employees query reported");
    }
};
