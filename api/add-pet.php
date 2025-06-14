<?php
session_start();
require_once '../system/config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Get user ID from session
$user_id = $_SESSION['user_id'];

try {
    // Start transaction
    $pdo->beginTransaction();

    // Handle file upload
    $image_path = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../public/uploads/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $new_filename = uniqid() . '.' . $file_extension;
        $upload_path = $upload_dir . $new_filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
            $image_path = 'uploads/' . $new_filename;
        } else {
            throw new Exception('Failed to upload image');
        }
    }

    // Insert into pets table
    $stmt = $pdo->prepare("INSERT INTO pets (user_id, name, age, image_path) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $user_id,
        $_POST['name'],
        $_POST['age'],
        $image_path
    ]);

    $pet_id = $pdo->lastInsertId();

    // Insert into care table
    $stmt = $pdo->prepare("INSERT INTO care (pet_id, brushing_frequency, medication, medication_frequency, food, food_frequency) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $pet_id,
        $_POST['brushing_frequency'],
        $_POST['medication'],
        $_POST['medication_frequency'],
        $_POST['food'],
        $_POST['food_frequency']
    ]);

    // Commit transaction
    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Pet added successfully']);

} catch (Exception $e) {
    // Rollback transaction on error
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?> 