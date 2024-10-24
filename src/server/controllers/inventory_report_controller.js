const pool = require("../pool");
const url = require('url');

module.exports = {
    getInventoryLogs: (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const { startDate, endDate } = parsedUrl.query;
        let dateFilter = '';
        let params = [];

        if (startDate && endDate) {
            dateFilter = 'WHERE DATE(il.log_date) BETWEEN DATE(?) AND DATE(?)';
            params = [startDate, endDate];
        }
        
        const query = `
            SELECT 
                il.log_id,
                il.ingredient_id,
                i.name as ingredient_name,
                il.action_type,
                il.quantity_change,
                DATE_FORMAT(il.log_date, '%Y-%m-%d') as log_date,
                TIME_FORMAT(il.log_time, '%H:%i:%s') as log_time
            FROM inventory_logs il
            JOIN inventory i ON il.ingredient_id = i.ingredient_id
            ${dateFilter}
            ORDER BY il.log_date DESC, il.log_time DESC
            LIMIT 500
        `;

        console.log('Executing logs query with dates:', startDate, endDate);

        pool.query(query, params, (error, results) => {
            if (error) {
                console.error('Error in logs query:', error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching inventory logs"
                }));
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                logs: results || []
            }));
        });
    },

    getStats: (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const { startDate, endDate } = parsedUrl.query;
        let dateFilter = '';
        let params = [];

        if (startDate && endDate) {
            dateFilter = 'WHERE DATE(il.log_date) BETWEEN DATE(?) AND DATE(?)';
            params = [startDate, endDate];
        }
        
        const statsQuery = `
            SELECT 
                i.name as ingredient_name,
                il.action_type,
                SUM(ABS(il.quantity_change)) as total_quantity
            FROM inventory_logs il
            JOIN inventory i ON il.ingredient_id = i.ingredient_id
            ${dateFilter}
            GROUP BY i.ingredient_id, i.name, il.action_type
            ORDER BY total_quantity DESC
        `;

        pool.query(statsQuery, params, (statsError, statsResults) => {
            if (statsError) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Server Error fetching inventory statistics"
                }));
                return;
            }

            const stats = {
                used: statsResults.filter(item => item.action_type === 'used')
                    .slice(0, 10),
                restock: statsResults.filter(item => item.action_type === 'restock')
                    .slice(0, 10),
                discarded: statsResults.filter(item => item.action_type === 'discarded')
                    .slice(0, 10)
            };

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                stats: stats
            }));
        });
    }
};