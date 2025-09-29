-- Migration script to add images column to products table
-- Run this if the products table already exists without the images column

USE sp_base;

-- Check if images column exists and add it if not
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'sp_base' 
    AND TABLE_NAME = 'products' 
    AND COLUMN_NAME = 'images'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE products ADD COLUMN images JSON AFTER image_url', 
    'SELECT "Column images already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing products to have empty images array if NULL
UPDATE products 
SET images = '[]' 
WHERE images IS NULL;
