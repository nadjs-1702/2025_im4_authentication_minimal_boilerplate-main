<?php
session_start();
require_once '../config/database.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit();
}

// Check if all required fields are present
if (!isset($_POST['name']) || !isset($_POST['age']) || !isset($_FILES['image']) || 
    !isset($_POST['brushing_frequency']) || !isset($_POST['medication']) || 
    !isset($_POST['medication_frequency'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit();
}

try {
    // Handle image upload
    $image = $_FILES['image'];
    $imageName = time() . '_' . basename($image['name']);
    $uploadDir = '../uploads/pets/';
    
    // Create directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $uploadPath = $uploadDir . $imageName;
    
    if (!move_uploaded_file($image['tmp_name'], $uploadPath)) {
        throw new Exception('Failed to upload image');
    }

    // Start transaction
    $pdo->beginTransaction();

    // Insert into pets table
    $stmt = $pdo->prepare("INSERT INTO pets (user_id, name, age, image_path) VALUES (?, ?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], $_POST['name'], $_POST['age'], $imageName]);
    
    $petId = $pdo->lastInsertId();

    // Insert into care table
    $stmt = $pdo->prepare("INSERT INTO care (pet_id, brushing_frequency, medication, medication_frequency) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $petId,
        $_POST['brushing_frequency'],
        $_POST['medication'],
        $_POST['medication_frequency']
    ]);

    // Commit transaction
    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Pet registered successfully']);

} catch (Exception $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    // Delete uploaded file if it exists
    if (isset($uploadPath) && file_exists($uploadPath)) {
        unlink($uploadPath);
    }
    
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} 