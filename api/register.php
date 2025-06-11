<?php
// Prevent any output before JSON response
ob_start();

// Start session and set headers
session_start();
header('Content-Type: application/json');

// Disable error display but enable logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

try {
    require_once '../system/config.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Log the incoming request
        error_log("Registration attempt - POST data: " . print_r($_POST, true));

        $email    = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (!$email || !$password) {
            throw new Exception("Email and password are required");
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format");
        }

        // Validate password length
        if (strlen($password) < 6) {
            throw new Exception("Password must be at least 6 characters long");
        }

        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        if ($stmt->fetch()) {
            throw new Exception("Email is already in use");
        }

        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert the new user
        $insert = $pdo->prepare("INSERT INTO users (email, password) VALUES (:email, :pass)");
        $result = $insert->execute([
            ':email' => $email,
            ':pass'  => $hashedPassword
        ]);

        if (!$result) {
            throw new Exception("Failed to create user account");
        }

        error_log("Registration successful for email: " . $email);
        echo json_encode([
            "status" => "success",
            "message" => "Registration successful"
        ]);
    } else {
        throw new Exception("Invalid request method");
    }
} catch (PDOException $e) {
    error_log("Database error during registration: " . $e->getMessage());
    echo json_encode([
        "status" => "error",
        "message" => "Database error occurred. Please try again later."
    ]);
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

// Clear any output buffer and send response
ob_end_clean();
