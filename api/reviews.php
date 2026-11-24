<?php
// api/reviews.php
require_once __DIR__ . '/db.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM reviews ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        echo json_encode(["success" => true, "count" => count($rows), "data" => $rows], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['customerName']) || empty($data['comment'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "customerName and comment are required"]);
            exit();
        }

        $stmt = $db->prepare("
            INSERT INTO reviews (customer_name, customer_role, comment, rating, avatar)
            VALUES (:name, :role, :comment, :rating, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80')
        ");
        $stmt->execute([
            ':name' => $data['customerName'],
            ':role' => !empty($data['customerRole']) ? $data['customerRole'] : 'Coffee Lover',
            ':comment' => $data['comment'],
            ':rating' => !empty($data['rating']) ? (int)$data['rating'] : 5
        ]);

        http_response_code(201);
        echo json_encode(["success" => true, "message" => "Review submitted"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>
