<?php
// api/newsletter.php
require_once __DIR__ . '/db.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC");
        $rows = $stmt->fetchAll();
        echo json_encode(["success" => true, "count" => count($rows), "data" => $rows], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['email'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Valid email required"]);
            exit();
        }

        $email = strtolower(trim($data['email']));
        $stmt = $db->prepare("INSERT IGNORE INTO newsletter_subscribers (email) VALUES (:email)");
        $stmt->execute([':email' => $email]);

        http_response_code(201);
        echo json_encode(["success" => true, "message" => "Subscribed to Alush Coffee Club!"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>
