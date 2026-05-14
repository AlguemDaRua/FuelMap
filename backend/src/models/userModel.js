const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ name, email, password_hash, role = 'gestor' }) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, password_hash, role]
  );
  return result.insertId;
};

module.exports = { findByEmail, findById, create };
