DELIMITER //

-- Ensure event scheduler is on
SET GLOBAL event_scheduler = ON//

-- Daily Inventory Summary Event
DROP EVENT IF EXISTS daily_inventory_summary_event//
CREATE EVENT daily_inventory_summary_event
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 23 HOUR + INTERVAL 59 MINUTE)
DO
BEGIN
    CALL generate_daily_inventory_summary();
END //

DELIMITER ;

SHOW EVENTS;