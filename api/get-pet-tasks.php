<?php
session_start();
require_once '../system/config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

try {
    // Get all pets with their care information for the logged-in user
    $stmt = $pdo->prepare("
        SELECT p.id, p.name, c.brushing_frequency, c.medication, c.medication_frequency, 
               c.food, c.food_frequency
        FROM pets p 
        LEFT JOIN care c ON p.id = c.pet_id 
        WHERE p.user_id = ?
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'pets' => $pets]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?> 