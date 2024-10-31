DELIMITER //

DROP TRIGGER IF EXISTS update_counter;;

CREATE TRIGGER update_counter 
AFTER UPDATE ON users 
FOR EACH ROW 
BEGIN
    DECLARE id INT;

    -- Get count of existing records
    SELECT COUNT(*) INTO id
    FROM discount_next_visit
    WHERE user_id = NEW.user_id;
     -- If no record exists, create new one '
    IF id = 0 THEN
        INSERT INTO discount_next_visit (user_id, counter)
        VALUES (NEW.user_id, FLOOR(NEW.points / 100));
        
    END IF;

    -- If points increased, update counter
    IF NEW.points > OLD.points AND NEW.points >= 100 THEN
        UPDATE discount_next_visit
        SET counter = FLOOR(NEW.points / 100)
        WHERE user_id = NEW.user_id;
    END IF;
END;;

DELIMITER ;

-- Check initial state for Tony
SELECT * FROM users WHERE email = 'ts@example.com';
SELECT * FROM discount_next_visit WHERE user_id = 2;

-- Update Tony's points to 150 (should create entry with counter = 1)
UPDATE users 
SET points = 150 
WHERE email = 'ts@example.com';

-- Check after first update
SELECT * FROM users WHERE email = 'ts@example.com';
SELECT * FROM discount_next_visit WHERE user_id = 2;

-- Update points to 250 (should update counter to 2)
UPDATE users 
SET points = 250 
WHERE email = 'ts@example.com';

-- Final check
SELECT * FROM users WHERE email = 'ts@example.com';
SELECT * FROM discount_next_visit WHERE user_id = 2;