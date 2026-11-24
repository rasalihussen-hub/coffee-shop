const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const { initDatabase, getPool } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Active admin sessions in-memory map (token -> session)
const activeSessions = new Map();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from current directory
app.use(express.static(path.join(__dirname)));

// Convenience page routes
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// =========================================================================
// API Routes
// =========================================================================

// 1. Health check & DB status
app.get('/api/health', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'ok',
      database: 'connected',
      mysqlCheck: rows[0].result === 2,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// =========================================================================
// Admin Authentication (alush / 9379)
// =========================================================================
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    const cleanUser = username.toString().trim().toLowerCase();
    const cleanPass = password.toString().trim();
    const inputHash = crypto.createHash('sha256').update(cleanPass).digest('hex');

    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, username, password_hash, full_name FROM admins WHERE LOWER(TRIM(username)) = ?',
      [cleanUser]
    );

    if (rows.length === 0 || rows[0].password_hash !== inputHash) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const admin = rows[0];
    const token = 'ach_adm_' + crypto.randomBytes(24).toString('hex');
    activeSessions.set(token, {
      id: admin.id,
      username: admin.username,
      fullName: admin.full_name,
      loginTime: Date.now()
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        username: admin.username,
        fullName: admin.full_name
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : req.query.token;

  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token);
    return res.json({ success: true, valid: true, admin: session });
  }
  return res.status(401).json({ success: false, valid: false, error: 'Unauthorized' });
});

app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : req.body?.token;
  if (token) activeSessions.delete(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

// 2. Menu Items
app.get('/api/menu', async (req, res) => {
  try {
    const pool = getPool();
    const { category } = req.query;

    let sql = 'SELECT * FROM menu_items WHERE is_available = 1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    sql += ' ORDER BY created_at ASC';

    const [rows] = await pool.query(sql, params);

    // Format fields to camelCase matching frontend expectations
    const formatted = rows.map(item => ({
      id: item.id,
      titleEn: item.title_en,
      titleAm: item.title_am,
      category: item.category,
      tagEn: item.tag_en,
      tagAm: item.tag_am,
      price: parseFloat(item.price),
      rating: item.rating ? item.rating.toString() : '4.9',
      descEn: item.desc_en,
      descAm: item.desc_am,
      image: item.image,
      isAvailable: Boolean(item.is_available)
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const pool = getPool();
    const {
      id,
      titleEn,
      titleAm,
      category,
      tagEn,
      tagAm,
      price,
      rating = 5.0,
      descEn,
      descAm,
      image
    } = req.body;

    if (!titleEn || !price) {
      return res.status(400).json({ success: false, error: 'titleEn and price are required' });
    }

    const itemId = id || 'item-' + Date.now();

    const sql = `
      INSERT INTO menu_items (id, title_en, title_am, category, tag_en, tag_am, price, rating, desc_en, desc_am, image, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    await pool.query(sql, [
      itemId,
      titleEn,
      titleAm || titleEn,
      category || 'hot',
      tagEn || 'Fresh',
      tagAm || 'ትኩስ',
      price,
      rating,
      descEn || '',
      descAm || '',
      image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
    ]);

    res.status(201).json({ success: true, message: 'Menu item created', itemId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { titleEn, titleAm, price, category, tagEn, isAvailable } = req.body;

    const updates = [];
    const params = [];

    if (titleEn !== undefined) { updates.push('title_en = ?'); params.push(titleEn); }
    if (titleAm !== undefined) { updates.push('title_am = ?'); params.push(titleAm); }
    if (price !== undefined) { updates.push('price = ?'); params.push(price); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (tagEn !== undefined) { updates.push('tag_en = ?'); params.push(tagEn); }
    if (isAvailable !== undefined) { updates.push('is_available = ?'); params.push(isAvailable ? 1 : 0); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    params.push(id);
    const sql = `UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Orders Management
app.post('/api/orders', async (req, res) => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      customerName = 'Guest Customer',
      customerPhone = '',
      customerEmail = '',
      paymentMethod = 'Telebirr',
      items = [],
      notes = ''
    } = req.body;

    if (!items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
    }

    // Calculate totals
    let subtotal = 0;
    items.forEach(item => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity, 10) || 1;
      subtotal += price * qty;
    });

    const vatTax = subtotal * 0.15; // 15% VAT
    const totalAmount = subtotal + vatTax;

    const orderCode = 'ACH-ORD-' + Math.floor(100000 + Math.random() * 900000);

    const orderSql = `
      INSERT INTO orders (order_code, customer_name, customer_phone, customer_email, payment_method, subtotal, vat_tax, total_amount, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
    `;

    const [orderResult] = await connection.query(orderSql, [
      orderCode,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      subtotal,
      vatTax,
      totalAmount,
      notes
    ]);

    const orderId = orderResult.insertId;

    // Insert order line items
    const itemSql = `
      INSERT INTO order_items (order_id, item_id, item_title, unit_price, quantity, total_price)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of items) {
      const unitPrice = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity, 10) || 1;
      const lineTotal = unitPrice * qty;
      const title = item.titleEn || item.titleAm || item.title || 'Coffee Item';

      await connection.query(itemSql, [
        orderId,
        item.id || 'custom',
        title,
        unitPrice,
        qty,
        lineTotal
      ]);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      orderCode,
      orderId,
      subtotal: subtotal.toFixed(2),
      vatTax: vatTax.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      paymentMethod,
      message: 'Order created successfully'
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    connection.release();
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const pool = getPool();
    const [orders] = await pool.query(`
      SELECT o.*, 
        COUNT(oi.id) AS total_items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    // Fetch line items for each order
    for (const order of orders) {
      const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/orders/:code', async (req, res) => {
  try {
    const pool = getPool();
    const { code } = req.params;

    const [orders] = await pool.query('SELECT * FROM orders WHERE order_code = ? OR id = ?', [code, code]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const order = orders[0];
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    order.items = items;

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Allowed: ${allowed.join(', ')}` });
    }

    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ? OR order_code = ?', [status, id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Reservations Management
app.post('/api/reservations', async (req, res) => {
  try {
    const pool = getPool();
    const {
      fullName,
      email,
      phone,
      guests = 2,
      date,
      timeSlot,
      specialRequests = ''
    } = req.body;

    if (!fullName || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ success: false, error: 'Full name, email, phone, date, and time slot are required' });
    }

    const reservationCode = 'ACH-RES-' + Math.floor(100000 + Math.random() * 900000);

    const sql = `
      INSERT INTO reservations (reservation_code, full_name, email, phone, guests, reservation_date, time_slot, special_requests, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')
    `;

    const [result] = await pool.query(sql, [
      reservationCode,
      fullName,
      email,
      phone,
      parseInt(guests, 10) || 2,
      date,
      timeSlot,
      specialRequests
    ]);

    res.status(201).json({
      success: true,
      reservationCode,
      reservationId: result.insertId,
      message: 'Reservation booked successfully',
      data: {
        code: reservationCode,
        name: fullName,
        guests,
        date,
        time: timeSlot,
        status: 'Confirmed'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/reservations', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM reservations ORDER BY reservation_date DESC, created_at DESC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/reservations/:id/status', async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Confirmed', 'Pending', 'Seated', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Allowed: ${allowed.join(', ')}` });
    }

    const [result] = await pool.query('UPDATE reservations SET status = ? WHERE id = ? OR reservation_code = ?', [status, id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    res.json({ success: true, message: `Reservation status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Newsletter
app.post('/api/newsletter', async (req, res) => {
  try {
    const pool = getPool();
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }

    await pool.query('INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)', [email.trim().toLowerCase()]);

    res.status(201).json({ success: true, message: 'Subscribed to Alush Coffee Club!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/newsletter', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const pool = getPool();
    const { customerName, customerRole, comment, rating = 5 } = req.body;

    if (!customerName || !comment) {
      return res.status(400).json({ success: false, error: 'customerName and comment are required' });
    }

    const sql = `
      INSERT INTO reviews (customer_name, customer_role, comment, rating, avatar)
      VALUES (?, ?, ?, ?, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80')
    `;

    const [result] = await pool.query(sql, [customerName, customerRole || 'Coffee Lover', comment, rating]);

    res.status(201).json({ success: true, id: result.insertId, message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Dashboard / Analytics Stats
app.get('/api/stats', async (req, res) => {
  try {
    const pool = getPool();

    const [[revRow]] = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS total_revenue 
      FROM orders 
      WHERE status != 'Cancelled'
    `);

    const [[ordersRow]] = await pool.query(`
      SELECT COUNT(*) AS total_orders,
             SUM(CASE WHEN status IN ('Pending', 'Preparing') THEN 1 ELSE 0 END) AS active_orders
      FROM orders
    `);

    const [[resRow]] = await pool.query(`
      SELECT COUNT(*) AS total_reservations,
             SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed_reservations
      FROM reservations
    `);

    const [[itemsRow]] = await pool.query('SELECT COUNT(*) AS total_items FROM menu_items');
    const [[subsRow]] = await pool.query('SELECT COUNT(*) AS total_subscribers FROM newsletter_subscribers');

    res.json({
      success: true,
      stats: {
        totalRevenue: parseFloat(revRow.total_revenue || 0).toFixed(2),
        totalOrders: ordersRow.total_orders || 0,
        activeOrders: ordersRow.active_orders || 0,
        totalReservations: resRow.total_reservations || 0,
        confirmedReservations: resRow.confirmed_reservations || 0,
        totalMenuItems: itemsRow.total_items || 0,
        totalSubscribers: subsRow.total_subscribers || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 404 / SPA Fallback to index.html for non-API GET requests
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start Server after DB init
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Alush Coffee Server running on port ${PORT}`);
      console.log(`👉 Storefront: http://localhost:${PORT}`);
      console.log(`👉 Admin Panel: http://localhost:${PORT}/admin.html`);
      console.log(`👉 API Health: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database on startup:', err.message);
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} (DB offline, check MySQL service)`);
    });
  });
