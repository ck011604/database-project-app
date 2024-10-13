-- Active: 1727921417886@@localhost@3306@restaurant_db
DROP PROCEDURE generate_daily_inventory_summary;
CREATE DEFINER=`root`@`localhost` PROCEDURE `generate_daily_inventory_summary`()
BEGIN
    DECLARE report_date DATE;
    SET report_date = CURDATE() - INTERVAL 1 DAY;
    -- Insert or update the inventory_daily_summary table
    INSERT INTO inventory_daily_summary (
        date, 
        ingredient_id, 
        starting_amount, 
        ending_amount, 
        restocked_amount, 
        used_amount
    )
    SELECT 
        report_date,
        i.ingredient_id,
        COALESCE(prev_summary.ending_amount, i.amount) AS starting_amount,
        i.amount AS ending_amount,
        COALESCE(restocked.amount, 0) AS restocked_amount,
        COALESCE(used.amount, 0) AS used_amount
    FROM 
        inventory i
        LEFT JOIN inventory_daily_summary prev_summary ON i.ingredient_id = prev_summary.ingredient_id
            AND prev_summary.date = report_date - INTERVAL 1 DAY
        LEFT JOIN (
            SELECT ingredient_id, SUM(quantity_change) AS amount
            FROM inventory_logs
            WHERE DATE(timestamp) = report_date AND action_type IN ('restock', 'manual_order')
            GROUP BY ingredient_id
        ) restocked ON i.ingredient_id = restocked.ingredient_id
        LEFT JOIN (
            SELECT ingredient_id, SUM(ABS(quantity_change)) AS amount
            FROM inventory_logs
            WHERE DATE(timestamp) = report_date AND action_type = 'usage'
            GROUP BY ingredient_id
        ) used ON i.ingredient_id = used.ingredient_id
    ON DUPLICATE KEY UPDATE
        starting_amount = VALUES(starting_amount),
        ending_amount = VALUES(ending_amount),
        restocked_amount = VALUES(restocked_amount),
        used_amount = VALUES(used_amount);
END