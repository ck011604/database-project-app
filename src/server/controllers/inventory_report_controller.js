const url = require('url');
const pool = require("../pool");

exports.getInventoryReport = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    const { reportType, startDate, endDate } = queryObject;

    let query;
    let params = [];

    try {
        switch(reportType) {
            case 'current':
                query = `SELECT name as ingredient_name, amount as current_amount, 
                         restock_threshold, restock_amount 
                         FROM inventory`;
                break;
            case 'weekly':
                query = `SELECT i.name as ingredient_name, 
                         MIN(ids.starting_amount) as initial_amount,
                         MAX(ids.ending_amount) as final_amount,
                         SUM(ids.restocked_amount) as total_restocked,
                         SUM(ids.used_amount) as total_used,
                         MAX(ids.ending_amount) - MIN(ids.starting_amount) as net_change
                         FROM inventory_daily_summary ids
                         JOIN inventory i ON ids.ingredient_id = i.ingredient_id
                         WHERE ids.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                         GROUP BY i.ingredient_id, i.name`;
                break;
            case 'monthly':
                query = `SELECT i.name as ingredient_name, 
                         MIN(ids.starting_amount) as initial_amount,
                         MAX(ids.ending_amount) as final_amount,
                         SUM(ids.restocked_amount) as total_restocked,
                         SUM(ids.used_amount) as total_used,
                         MAX(ids.ending_amount) - MIN(ids.starting_amount) as net_change
                         FROM inventory_daily_summary ids
                         JOIN inventory i ON ids.ingredient_id = i.ingredient_id
                         WHERE ids.date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
                         GROUP BY i.ingredient_id, i.name`;
                break;
            case 'yearly':
                query = `SELECT i.name as ingredient_name, 
                         MIN(ids.starting_amount) as initial_amount,
                         MAX(ids.ending_amount) as final_amount,
                         SUM(ids.restocked_amount) as total_restocked,
                         SUM(ids.used_amount) as total_used,
                         MAX(ids.ending_amount) - MIN(ids.starting_amount) as net_change
                         FROM inventory_daily_summary ids
                         JOIN inventory i ON ids.ingredient_id = i.ingredient_id
                         WHERE ids.date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
                         GROUP BY i.ingredient_id, i.name`;
                break;
            case 'custom':
                if (!startDate || !endDate) {
                    throw new Error('Start date and end date are required for custom reports');
                }
                query = `SELECT i.name as ingredient_name, 
                         MIN(ids.starting_amount) as initial_amount,
                         MAX(ids.ending_amount) as final_amount,
                         SUM(ids.restocked_amount) as total_restocked,
                         SUM(ids.used_amount) as total_used,
                         MAX(ids.ending_amount) - MIN(ids.starting_amount) as net_change
                         FROM inventory_daily_summary ids
                         JOIN inventory i ON ids.ingredient_id = i.ingredient_id
                         WHERE ids.date BETWEEN ? AND ?
                         GROUP BY i.ingredient_id, i.name`;
                params = [startDate, endDate];
                break;
            default:
                throw new Error('Invalid report type');
        }

        const [rows] = await pool.query(query, params);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (error) {
        console.error('Error generating inventory report:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred while generating the inventory report' }));
    }
};