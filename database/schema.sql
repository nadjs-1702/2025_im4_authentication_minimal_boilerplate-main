-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create care table
CREATE TABLE IF NOT EXISTS care (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    brushing_frequency INT NOT NULL,
    medication VARCHAR(255) NOT NULL,
    medication_frequency INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id)
); 