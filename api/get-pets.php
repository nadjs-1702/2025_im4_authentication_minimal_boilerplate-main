<?php
session_start();
require_once '../system/config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

try {
    // Get pets for the logged-in user
    $stmt = $pdo->prepare("SELECT id, name, image_path FROM pets WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'pets' => $pets]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?> 