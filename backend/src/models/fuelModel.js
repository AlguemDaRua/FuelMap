const db = require('../config/db');

const getByStation = async (stationId) => {
  const [rows] = await db.query(
    'SELECT * FROM fuels WHERE station_id = ? ORDER BY type ASC',
    [stationId]
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM fuels WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

const updateStock = async (id, { stock_liters, price }) => {
  const fields = [];
  const values = [];

  if (stock_liters !== undefined) {
    fields.push('stock_liters = ?');
    values.push(stock_liters);
  }
  if (price !== undefined) {
    fields.push('price = ?');
    values.push(price);
  }

  if (fields.length === 0) return false;

  values.push(id);
  await db.query(
    `UPDATE fuels SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return true;
};

const createFuel = async ({ station_id, type, price, stock_liters, max_capacity }) => {
  const [result] = await db.query(
    `INSERT INTO fuels (station_id, type, price, stock_liters, max_capacity)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE price = VALUES(price), stock_liters = VALUES(stock_liters)`,
    [station_id, type, price || 0, stock_liters || 0, max_capacity || 15000]
  );
  return result.insertId || result.affectedRows;
};

module.exports = { getByStation, getById, updateStock, createFuel };
