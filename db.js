const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'coffee_shop_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// Create pool
let pool;

async function initDatabase() {
  try {
    // First connect without specifying the database to ensure it exists
    const adminConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      charset: 'utf8mb4'
    });

    await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await adminConn.end();

    // Now initialize connection pool
    pool = mysql.createPool(dbConfig);

    // Run schema migrations/initialization
    const schemaFile = path.join(__dirname, 'database.sql');
    if (fs.existsSync(schemaFile)) {
      const sqlContent = fs.readFileSync(schemaFile, 'utf8');
      
      // Split into executable statements, stripping comments and delimiter blocks
      const cleanSql = sqlContent
        .replace(/--.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
      
      const statements = cleanSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.toUpperCase().startsWith('CREATE DATABASE') && !stmt.toUpperCase().startsWith('USE'));

      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (err) {
          // Log only non-duplicate errors
          if (!err.message.includes('already exists') && !err.message.includes('Duplicate entry')) {
            console.warn(`[DB init notice]: ${err.message}`);
          }
        }
      }
    }

    console.log(`[MySQL] Successfully connected to database: ${dbConfig.database}`);
    return pool;
  } catch (err) {
    console.error('[MySQL Connection Error]:', err.message);
    console.error('Make sure MySQL is running in XAMPP on port 3306.');
    throw err;
  }
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

module.exports = {
  initDatabase,
  getPool
};

