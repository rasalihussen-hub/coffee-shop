<?php
// api/login.php - Admin Authentication
require_once __DIR__ . '/db.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['username']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Username and password required"]);
            exit();
        }

        $username = strtolower(trim((string)$data['username']));
        $password = trim((string)$data['password']);
        $hash = hash('sha256', $password);

        $stmt = $db->prepare("SELECT id, username, password_hash, full_name FROM admins WHERE LOWER(TRIM(username)) = :uname");
        $stmt->execute([':uname' => $username]);
        $admin = $stmt->fetch();

        if (!$admin || $admin['password_hash'] !== $hash) {
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "Invalid username or password"]);
            exit();
        }

        $token = 'ach_adm_' . bin2hex(random_bytes(24));

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "token" => $token,
            "admin" => [
                "username" => $admin['username'],
                "fullName" => $admin['full_name']
            ]
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
}
?>
