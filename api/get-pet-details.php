<?php
session_start();
require_once '../system/config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Check if pet ID is provided
if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'Pet ID not provided']);
    exit;
}

try {
    // Get pet details with care information
    $stmt = $pdo->prepare("
        SELECT p.*, c.brushing_frequency, c.medication, c.medication_frequency, 
               c.food, c.food_frequency
        FROM pets p 
        LEFT JOIN care c ON p.id = c.pet_id 
        WHERE p.id = ? AND p.user_id = ?
    ");
    $stmt->execute([$_GET['id'], $_SESSION['user_id']]);
    $pet = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($pet) {
        echo json_encode(['success' => true, 'pet' => $pet]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Pet not found']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?> 