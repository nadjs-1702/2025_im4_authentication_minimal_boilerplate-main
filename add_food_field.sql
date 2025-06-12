-- Add food field to care table
ALTER TABLE `care` 
ADD COLUMN `food` varchar(255) DEFAULT NULL AFTER `medication_frequency`,
ADD COLUMN `food_frequency` int(11) DEFAULT NULL AFTER `food`;

-- Update existing records to have NULL values for new fields
UPDATE `care` SET `food` = NULL, `food_frequency` = NULL; 