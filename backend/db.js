const mysql = require('mysql2/promise');

// Database configuration
const config = {
  host: process.env.DB_HOST || 'mariadb',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'userdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// Initialize connection pool
const initPool = async () => {
  try {
    pool = mysql.createPool(config);
    console.log('Database connection pool created');
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('Successfully connected to MariaDB');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('Error connecting to MariaDB:', error.message);
    // Retry connection after 5 seconds
    setTimeout(initPool, 5000);
    throw error;
  }
};

// Get pool instance
const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initPool first.');
  }
  return pool;
};

module.exports = {
  initPool,
  getPool
};
