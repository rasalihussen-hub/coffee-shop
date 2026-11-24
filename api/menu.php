<?php
// api/menu.php
require_once __DIR__ . '/db.php';

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $sql = "SELECT * FROM menu_items WHERE is_available = 1";
        $params = [];

        if ($category && $category !== 'all') {
            $sql .= " AND category = :cat";
            $params[':cat'] = $category;
        }
        $sql .= " ORDER BY created_at ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll();

        $formatted = array_map(function($item) {
            return [
                "id" => $item['id'],
                "titleEn" => $item['title_en'],
                "titleAm" => $item['title_am'],
                "category" => $item['category'],
                "tagEn" => $item['tag_en'],
                "tagAm" => $item['tag_am'],
                "price" => (float)$item['price'],
                "rating" => (string)$item['rating'],
                "descEn" => $item['desc_en'],
                "descAm" => $item['desc_am'],
                "image" => $item['image'],
                "isAvailable" => (bool)$item['is_available']
            ];
        }, $items);

        echo json_encode(["success" => true, "count" => count($formatted), "data" => $formatted], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['titleEn']) || empty($data['price'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "titleEn and price are required"]);
            exit();
        }

        $id = !empty($data['id']) ? $data['id'] : 'item-' . time();
        $stmt = $db->prepare("
            INSERT INTO menu_items (id, title_en, title_am, category, tag_en, tag_am, price, rating, desc_en, desc_am, image, is_available)
            VALUES (:id, :title_en, :title_am, :category, :tag_en, :tag_am, :price, :rating, :desc_en, :desc_am, :image, 1)
        ");

        $stmt->execute([
            ':id' => $id,
            ':title_en' => $data['titleEn'],
            ':title_am' => !empty($data['titleAm']) ? $data['titleAm'] : $data['titleEn'],
            ':category' => !empty($data['category']) ? $data['category'] : 'hot',
            ':tag_en' => !empty($data['tagEn']) ? $data['tagEn'] : 'Fresh',
            ':tag_am' => !empty($data['tagAm']) ? $data['tagAm'] : 'ትኩስ',
            ':price' => $data['price'],
            ':rating' => !empty($data['rating']) ? $data['rating'] : 5.0,
            ':desc_en' => !empty($data['descEn']) ? $data['descEn'] : '',
            ':desc_am' => !empty($data['descAm']) ? $data['descAm'] : '',
            ':image' => !empty($data['image']) ? $data['image'] : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
        ]);

        http_response_code(201);
        echo json_encode(["success" => true, "message" => "Menu item created", "itemId" => $id]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>
