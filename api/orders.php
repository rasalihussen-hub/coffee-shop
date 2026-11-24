<?php
// api/orders.php
require_once __DIR__ . '/db.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $db->query("
            SELECT o.*, COUNT(oi.id) AS total_items_count
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        ");
        $orders = $stmt->fetchAll();

        foreach ($orders as &$order) {
            $itemStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = :oid");
            $itemStmt->execute([':oid' => $order['id']]);
            $order['items'] = $itemStmt->fetchAll();
        }

        echo json_encode(["success" => true, "count" => count($orders), "data" => $orders], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['items'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Order must contain at least one item"]);
            exit();
        }

        $customerName = !empty($data['customerName']) ? $data['customerName'] : 'Guest Customer';
        $customerPhone = !empty($data['customerPhone']) ? $data['customerPhone'] : '';
        $customerEmail = !empty($data['customerEmail']) ? $data['customerEmail'] : '';
        $paymentMethod = !empty($data['paymentMethod']) ? $data['paymentMethod'] : 'Telebirr';
        $notes = !empty($data['notes']) ? $data['notes'] : '';
        $items = $data['items'];

        $subtotal = 0;
        foreach ($items as $item) {
            $price = isset($item['price']) ? (float)$item['price'] : 0;
            $qty = isset($item['quantity']) ? (int)$item['quantity'] : 1;
            $subtotal += ($price * $qty);
        }

        $vatTax = $subtotal * 0.15;
        $totalAmount = $subtotal + $vatTax;
        $orderCode = 'ACH-ORD-' . mt_rand(100000, 999999);

        $db->beginTransaction();

        $stmt = $db->prepare("
            INSERT INTO orders (order_code, customer_name, customer_phone, customer_email, payment_method, subtotal, vat_tax, total_amount, status, notes)
            VALUES (:code, :name, :phone, :email, :pm, :sub, :vat, :tot, 'Pending', :notes)
        ");
        $stmt->execute([
            ':code' => $orderCode,
            ':name' => $customerName,
            ':phone' => $customerPhone,
            ':email' => $customerEmail,
            ':pm' => $paymentMethod,
            ':sub' => $subtotal,
            ':vat' => $vatTax,
            ':tot' => $totalAmount,
            ':notes' => $notes
        ]);

        $orderId = $db->lastInsertId();

        $itemStmt = $db->prepare("
            INSERT INTO order_items (order_id, item_id, item_title, unit_price, quantity, total_price)
            VALUES (:oid, :iid, :title, :uprice, :qty, :tprice)
        ");

        foreach ($items as $item) {
            $uprice = isset($item['price']) ? (float)$item['price'] : 0;
            $qty = isset($item['quantity']) ? (int)$item['quantity'] : 1;
            $tprice = $uprice * $qty;
            $title = !empty($item['titleEn']) ? $item['titleEn'] : (!empty($item['title']) ? $item['title'] : 'Coffee Item');

            $itemStmt->execute([
                ':oid' => $orderId,
                ':iid' => !empty($item['id']) ? $item['id'] : 'custom',
                ':title' => $title,
                ':uprice' => $uprice,
                ':qty' => $qty,
                ':tprice' => $tprice
            ]);
        }

        $db->commit();

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "orderCode" => $orderCode,
            "orderId" => (int)$orderId,
            "subtotal" => number_format($subtotal, 2, '.', ''),
            "vatTax" => number_format($vatTax, 2, '.', ''),
            "totalAmount" => number_format($totalAmount, 2, '.', ''),
            "paymentMethod" => $paymentMethod,
            "message" => "Order created successfully"
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
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

        $stmt = $db->prepare("UPDATE orders SET status = :status WHERE id = :id OR order_code = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);

        echo json_encode(["success" => true, "message" => "Order status updated to $status"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>
