const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT, 10) || 4000,
  user:     process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

pool.getConnection()
  .then(conn => {
    console.log('🚀 Conectado à fuelmap_db no TiDB Cloud!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro de conexão à BD:', err.message);
  });

module.exports = pool;