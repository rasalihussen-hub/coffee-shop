# ☕ Alush Coffee - Server & MySQL Database Backend

Full-stack artisanal coffee website and management system with **MySQL database**, **Node.js Express REST API**, and **XAMPP / PHP dual-support**.

---

## 🚀 Quick Start (Running with Node.js)

### 1. Ensure MySQL is Running
Make sure **MySQL** is started in your XAMPP Control Panel (or running on `localhost:3306`).
- Default Database: `coffee_shop_db`
- Default User: `root`
- Default Password: `""` (empty)

### 2. Start the Server
Open your terminal in `c:\alush\web\coffee-shop` and run:

```bash
npm start
```
*(Or `npm run dev` for auto-reloading during development).*

The server will automatically:
1. Connect to MySQL on port 3306
2. Auto-create the `coffee_shop_db` database if not present
3. Auto-create all required tables with seed data
4. Serve both the storefront website and admin dashboard

### 3. Open in Browser
- ☕ **Storefront Website:** [http://localhost:5000](http://localhost:5000)
- 🔐 **Admin Login:** [http://localhost:5000/login](http://localhost:5000/login) (or [login.html](file:///c:/alush/web/coffee-shop/login.html))
- 📊 **Barista & Admin Dashboard:** [http://localhost:5000/admin.html](http://localhost:5000/admin.html)
- 🩺 **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 🔑 Admin Credentials
- **Username:** `alush`
- **Password:** `9379`

---

## 🗄️ MySQL Database (`coffee_shop_db`)

The database uses `utf8mb4` to support English and Amharic (ግዕዝ / አማርኛ) text:

| Table | Description |
| :--- | :--- |
| `menu_items` | Handcrafted coffee, cold brews, and Ethiopian pastries with ETB prices |
| `orders` | Customer orders, Telebirr/CBE payment methods, VAT (15%), totals & statuses |
| `order_items` | Line items tied to each order (`order_id`, `unit_price`, `quantity`, `total`) |
| `reservations` | Table bookings with party size, dates, time slots, confirmation codes |
| `newsletter_subscribers` | Alush Coffee Club email members |
| `reviews` | Customer ratings, reviews, and testimonials |
| `admins` | Authenticated managers (`alush` / `9379`) with SHA-256 password hash |

> **Manual SQL Import (Optional):**
> You can also import `database.sql` directly using **phpMyAdmin** (`http://localhost/phpmyadmin`).

---

## 📡 REST API Reference

### 📋 Menu
- `GET /api/menu` - Fetch all items (optional `?category=hot|cold|bakery`)
- `POST /api/menu` - Add a new menu item
- `PUT /api/menu/:id` - Update price or stock availability
- `DELETE /api/menu/:id` - Delete an item

### 🛍️ Orders
- `POST /api/orders` - Place new order (calculates VAT, generates code like `ACH-ORD-123456`)
- `GET /api/orders` - View all orders with items breakdown
- `GET /api/orders/:code` - Track a single order by code
- `PATCH /api/orders/:id/status` - Update status (`Pending` ➔ `Preparing` ➔ `Ready` ➔ `Completed` ➔ `Cancelled`)

### 📅 Table Reservations
- `POST /api/reservations` - Book table (saves to MySQL and generates `ACH-RES-XXXXXX`)
- `GET /api/reservations` - List all reservations
- `PATCH /api/reservations/:id/status` - Update status (`Confirmed`, `Pending`, `Seated`, `Cancelled`)

### 📧 Newsletter & Stats
- `POST /api/newsletter` - Subscribe email address
- `GET /api/newsletter` - View subscriber list
- `GET /api/stats` - Dashboard analytics (Revenue in ETB, Orders count, Booked tables)

---

## 🐘 PHP / XAMPP Apache Option

If you prefer to run directly through XAMPP Apache instead of Node.js:
All endpoints are also available as pure PHP scripts under `/api/`:
- `api/menu.php`
- `api/orders.php`
- `api/reservations.php`
- `api/newsletter.php`
- `api/stats.php`

Copy or link the folder to `C:\xampp\htdocs\coffee-shop`, start Apache & MySQL in XAMPP, and navigate to:
`http://localhost/coffee-shop/`

---

## 🎨 Features
- **Bilingual Interface:** Instant English & Amharic (አማርኛ) translation
- **Ethiopian Payment Options:** Telebirr (ቴሌብር), CBE Birr, Awash Bank, Cash
- **Live Orders & Table Bookings:** Saved directly into MySQL
- **Admin Dashboard:** Real-time revenue tracking, order status controls, and menu management

