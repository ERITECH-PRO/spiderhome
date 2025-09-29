-- Simple migration script to add images column to products table
-- Use this if the previous script doesn't work

USE sp_base;

-- Simply try to add the column (will fail if it already exists, which is fine)
ALTER TABLE products ADD COLUMN images JSON AFTER image_url;

-- Update existing products to have empty images array if NULL
UPDATE products 
SET images = '[]' 
WHERE images IS NULL;
