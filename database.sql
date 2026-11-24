-- =========================================================================
-- Alush Coffee - MySQL Database Schema & Seed Data
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `coffee_shop_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `coffee_shop_db`;

-- -------------------------------------------------------------------------
-- 1. Table: menu_items
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title_en` VARCHAR(150) NOT NULL,
  `title_am` VARCHAR(150) NOT NULL,
  `category` ENUM('hot', 'cold', 'bakery') NOT NULL DEFAULT 'hot',
  `tag_en` VARCHAR(100) DEFAULT NULL,
  `tag_am` VARCHAR(100) DEFAULT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `rating` DECIMAL(2, 1) DEFAULT 4.9,
  `desc_en` TEXT DEFAULT NULL,
  `desc_am` TEXT DEFAULT NULL,
  `image` VARCHAR(500) NOT NULL,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 2. Table: orders
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) UNIQUE NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL DEFAULT 'Guest Customer',
  `customer_phone` VARCHAR(50) DEFAULT NULL,
  `customer_email` VARCHAR(100) DEFAULT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Telebirr',
  `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `vat_tax` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 3. Table: order_items
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `item_id` VARCHAR(50) NOT NULL,
  `item_title` VARCHAR(150) NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(10, 2) NOT NULL,
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 4. Table: reservations
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reservation_code` VARCHAR(50) UNIQUE NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `guests` INT NOT NULL DEFAULT 2,
  `reservation_date` DATE NOT NULL,
  `time_slot` VARCHAR(50) NOT NULL,
  `special_requests` TEXT DEFAULT NULL,
  `status` ENUM('Confirmed', 'Pending', 'Seated', 'Cancelled') NOT NULL DEFAULT 'Confirmed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 5. Table: newsletter_subscribers
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 6. Table: reviews
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_role` VARCHAR(100) DEFAULT NULL,
  `comment` TEXT NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `avatar` VARCHAR(500) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- 7. Table: admins
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) DEFAULT 'Alush Admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------------
-- Seed Data: menu_items
-- -------------------------------------------------------------------------
INSERT INTO `menu_items` (`id`, `title_en`, `title_am`, `category`, `tag_en`, `tag_am`, `price`, `rating`, `desc_en`, `desc_am`, `image`) VALUES
('c1', 'Traditional Jebena Buna', 'ባህላዊ የጀበና ቡና ከተናዳም ጋር', 'hot', 'Cultural Classic', 'ባህላዊ ክላሲክ', 80.00, 5.0, 'Authentic clay pot brewed single-origin coffee served with fresh Ruta (Tena’adam), popped corn, and incense smoke.', 'በባህላዊ ሸክላ ጀበና በእጣን መዓዛ፣ ከተናዳምና ከፈንድሻ ጋር የሚቀርብ ልዩ የሀበሻ ቡና።', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'),
('c2', 'Yirgacheffe V60 Pour-Over', 'የይርጋጨፌ ቪ60 ፑር-ኦቨር', 'hot', 'Single Origin', 'ነጠላ ዝርያ', 150.00, 4.9, 'Hand-poured specialty roast boasting vibrant notes of wild jasmine blossom, bergamot, and sweet lemon citrus.', 'የጃስሚን አበባና የሎሚ መዓዛ ያለው በጥበብ የተጣራ የይርጋጨፌ ነጠላ ዝርያ ቡና።', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'),
('c3', 'Sidama Honey Flat White', 'የሲዳማ ማር ፍላት ዋይት', 'hot', 'Signature', 'ተወዳጅ', 130.00, 4.9, 'Velvety microfoam poured over double ristretto shots with notes of stone peach and pure Ethiopian honey.', 'የሲዳማ ድርብ ሾት ቡና ከለሰለሰ የወተት አረፋና ከተፈጥሮ ማር ጣዕም ጋር።', 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80'),
('c4', 'Kaffa Cold Brew Reserve', 'የከፋ ኮልድ ብሩ ሪዘርቭ', 'cold', '18hr Steeped', 'ለ18 ሰዓት የረጠበ', 160.00, 4.8, 'Steeped for 18 hours using premium Kaffa forest beans, providing a rich, naturally chocolatey chilled flavor.', 'ከከፋ ጫካ በተሰበሰቡ ፍሬዎች ለ18 ሰዓታት ቀዝቅዞ የረጠበ ቸኮሌታማ ቀዝቃዛ ቡና።', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'),
('c5', 'Iced Caramel Macchiato', 'አይስድ ካራሜል ማኪያቶ', 'cold', 'Addis Favorite', 'የአዲስ ተወዳጅ', 120.00, 4.9, 'Chilled whole milk over ice, marked with freshly extracted Harar espresso and topped with golden caramel drizzle.', 'በበረዶ የቀዘቀዘ ወተት ከሐረር ኤስፕሬሶና ከወርቃማ ካራሜል ሽሮፕ ጋር።', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80'),
('c6', 'Spiced Habesha Chai Latte', 'የተቀመመ የሀበሻ ሻይ ላቴ', 'hot', 'Aromatic Spice', 'ቅመማ ቅመም', 90.00, 4.8, 'Traditional highland black tea slow-brewed with fresh cloves, cardamom, ginger, and steamed milk.', 'በቅርንፉድ፣ በኮረሪማና በዝንጅብል ቅመሞች ተፈልቶ ከወተት ጋር የቀረበ ባህላዊ ሻይ።', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'),
('c7', 'Crispy Beef & Lentil Sambusa', 'ትኩስ የስጋና የምስር ሳምቡሳ (2 ፍሬ)', 'bakery', 'Fresh Baked', 'ትኩስ መክሰስ', 95.00, 5.0, 'Golden hand-folded crispy pastry pockets stuffed with seasoned minced beef or spiced green lentils.', 'በጥንቃቄ ተጠቅልሎ በደቃቁ የበሰለ ጥርት ያለ የስጋ ወይም የምስር ሳምቡሳ።', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'),
('c8', 'Honey Pistachio Baklava', 'የማርና ፒስታቺዮ ባክላቫ', 'bakery', 'Sweet Delight', 'ጣፋጭ', 120.00, 4.9, 'Layers of delicate flaky phyllo dough packed with crushed pistachios and drenched in aromatic local wild honey.', 'በተፈጨ ፒስታቺዮ የተሞላ እና በንፁህ የተፈጥሮ ማር የተለወሰ ተወዳጅ ባክላቫ።', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'),
('special-honey-macchiato', 'Spiced Sidama Honey Macchiato', 'የተቀመመ የሲዳማ ማኪያቶ ከማር ጋር', 'hot', 'Seasonal Special', 'የወቅቱ ልዩ ስጦታ', 140.00, 5.0, 'Authentic Sidama double espresso infused with pure Gojjam wild honey, warm cardamom, cinnamon spice, and velvety steamed milk foam.', 'የሲዳማ ድርብ ኤስፕሬሶ ከጎጃም የተፈጥሮ ማር፣ ኮረሪማ፣ ቀረፋ እና ለስላሳ የወተት አረፋ ጋር የተዋሃደ ልዩ ጣዕም።', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=80')
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`);

-- -------------------------------------------------------------------------
-- Seed Data: reviews
-- -------------------------------------------------------------------------
INSERT INTO `reviews` (`customer_name`, `customer_role`, `comment`, `rating`, `avatar`, `is_featured`) VALUES
('Bethlehem Tadesse', 'Tech Entrepreneur, Bole', 'Alush Coffee has the best traditional Jebena Buna in Bole! The scent of frankincense and the warmth of the staff make working here such a pleasure.', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', 0),
('Dawit Haile', 'Coffee Taster & Exporter', 'The Yirgacheffe pour-over is magnificent. You can taste the authentic citrus and floral notes. Plus, paying with Telebirr makes quick stops completely seamless!', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', 1),
('Alula Girma', 'Architect & Designer', 'Their fresh crispy Sambusas paired with spiced tea or a cold brew are unmatched. Outstanding ambiance and great Ethiopian hospitality.', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', 0);

-- -------------------------------------------------------------------------
-- Seed Data: admins (username: alush, password: 9379)
-- -------------------------------------------------------------------------
INSERT INTO `admins` (`username`, `password_hash`, `full_name`) VALUES
('alush', 'fd7aacebddf703f8ff43dd879353d00541d403daf6fec7e38d4582f5179ddab5', 'Alush Coffee Manager')
ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`);

-- -------------------------------------------------------------------------
-- Seed Data: sample initial reservations
-- -------------------------------------------------------------------------
INSERT INTO `reservations` (`reservation_code`, `full_name`, `email`, `phone`, `guests`, `reservation_date`, `time_slot`, `special_requests`, `status`) VALUES
('ACH-RES-842109', 'Abebe Bikila', 'abebe@example.com', '+251 91 123 4567', 2, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), '10:00 AM', 'Window view near power outlet for laptop', 'Confirmed'),
('ACH-RES-951340', 'Selamawit Desta', 'selam@example.com', '+251 92 345 6789', 4, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), '03:00 PM', 'Traditional Buna ceremony table', 'Pending')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- -------------------------------------------------------------------------
-- Seed Data: sample initial order
-- -------------------------------------------------------------------------
INSERT INTO `orders` (`id`, `order_code`, `customer_name`, `customer_phone`, `customer_email`, `payment_method`, `subtotal`, `vat_tax`, `total_amount`, `status`, `notes`) VALUES
(1, 'ACH-ORD-774219', 'Kidus Assefa', '+251 91 222 3344', 'kidus@example.com', 'Telebirr', 230.00, 34.50, 264.50, 'Preparing', 'Extra hot pour-over')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `order_items` (`order_id`, `item_id`, `item_title`, `unit_price`, `quantity`, `total_price`) VALUES
(1, 'c1', 'Traditional Jebena Buna', 80.00, 1, 80.00),
(1, 'c2', 'Yirgacheffe V60 Pour-Over', 150.00, 1, 150.00)
ON DUPLICATE KEY UPDATE `quantity` = VALUES(`quantity`);

