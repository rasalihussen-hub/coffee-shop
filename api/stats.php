<?php
// api/stats.php
require_once __DIR__ . '/db.php';

$database = new Database();
$db = $database->getConnection();

try {
    $revStmt = $db->query("SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE status != 'Cancelled'");
    $revRow = $revStmt->fetch();

    $ordersStmt = $db->query("
        SELECT COUNT(*) AS total_orders,
               SUM(CASE WHEN status IN ('Pending', 'Preparing') THEN 1 ELSE 0 END) AS active_orders
        FROM orders
    ");
    $ordersRow = $ordersStmt->fetch();

    $resStmt = $db->query("
        SELECT COUNT(*) AS total_reservations,
               SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed_reservations
        FROM reservations
    ");
    $resRow = $resStmt->fetch();

    $itemsStmt = $db->query("SELECT COUNT(*) AS total_items FROM menu_items");
    $itemsRow = $itemsStmt->fetch();

    $subsStmt = $db->query("SELECT COUNT(*) AS total_subscribers FROM newsletter_subscribers");
    $subsRow = $subsStmt->fetch();

    echo json_encode([
        "success" => true,
        "stats" => [
            "totalRevenue" => number_format((float)($revRow['total_revenue'] ?? 0), 2, '.', ''),
            "totalOrders" => (int)($ordersRow['total_orders'] ?? 0),
            "activeOrders" => (int)($ordersRow['active_orders'] ?? 0),
            "totalReservations" => (int)($resRow['total_reservations'] ?? 0),
            "confirmedReservations" => (int)($resRow['confirmed_reservations'] ?? 0),
            "totalMenuItems" => (int)($itemsRow['total_items'] ?? 0),
            "totalSubscribers" => (int)($subsRow['total_subscribers'] ?? 0)
        ]
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
