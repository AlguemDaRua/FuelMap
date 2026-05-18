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
    'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ name, email, phone, password_hash, role = 'usuario' }) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || null, password_hash, role]
  );
  return result.insertId;
};

const getAll = async () => {
  const [rows] = await db.query(
    'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

module.exports = { findByEmail, findById, create, getAll };
