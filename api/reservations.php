<?php
// api/reservations.php
require_once __DIR__ . '/db.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM reservations ORDER BY reservation_date DESC, created_at DESC");
        $rows = $stmt->fetchAll();
        echo json_encode(["success" => true, "count" => count($rows), "data" => $rows], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['fullName']) || empty($data['email']) || empty($data['phone']) || empty($data['date']) || empty($data['timeSlot'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "fullName, email, phone, date, and timeSlot are required"]);
            exit();
        }

        $code = 'ACH-RES-' . mt_rand(100000, 999999);
        $guests = isset($data['guests']) ? (int)$data['guests'] : 2;
        $notes = isset($data['specialRequests']) ? $data['specialRequests'] : '';

        $stmt = $db->prepare("
            INSERT INTO reservations (reservation_code, full_name, email, phone, guests, reservation_date, time_slot, special_requests, status)
            VALUES (:code, :name, :email, :phone, :guests, :rdate, :rtime, :notes, 'Confirmed')
        ");

        $stmt->execute([
            ':code' => $code,
            ':name' => $data['fullName'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':guests' => $guests,
            ':rdate' => $data['date'],
            ':rtime' => $data['timeSlot'],
            ':notes' => $notes
        ]);

        $resId = $db->lastInsertId();

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "reservationCode" => $code,
            "reservationId" => (int)$resId,
            "message" => "Reservation booked successfully",
            "data" => [
                "code" => $code,
                "name" => $data['fullName'],
                "guests" => $guests,
                "date" => $data['date'],
                "time" => $data['timeSlot'],
                "status" => "Confirmed"
            ]
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} elseif ($method === 'PATCH') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? $_GET['id'] : (isset($data['id']) ? $data['id'] : null);
        $status = isset($data['status']) ? $data['status'] : null;

        if (!$id || !$status) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "id and status are required"]);
            exit();
        }

        $stmt = $db->prepare("UPDATE reservations SET status = :status WHERE id = :id OR reservation_code = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);

        echo json_encode(["success" => true, "message" => "Reservation status updated to $status"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>
