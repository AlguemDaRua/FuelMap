const db = require('../config/db');

const create = async ({ station_id, fuel_type, quantity, operator_id, refuel_date, refuel_time, observations }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO refueling_records
         (station_id, fuel_type, quantity, operator_id, refuel_date, refuel_time, observations)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [station_id, fuel_type, quantity, operator_id || null, refuel_date, refuel_time, observations || null]
    );

    await conn.query(
      `UPDATE fuels
       SET stock_liters = stock_liters + ?
       WHERE station_id = ? AND type = ?`,
      [quantity, station_id, fuel_type]
    );

    await conn.commit();
    return result.insertId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const getByStation = async (stationId, limit = 50) => {
  const [rows] = await db.query(
    `SELECT r.*, u.name AS operator_name
     FROM refueling_records r
     LEFT JOIN users u ON u.id = r.operator_id
     WHERE r.station_id = ?
     ORDER BY r.refuel_date DESC, r.refuel_time DESC
     LIMIT ?`,
    [stationId, limit]
  );
  return rows;
};

const getAll = async (limit = 100) => {
  const [rows] = await db.query(
    `SELECT r.*, s.name AS station_name, u.name AS operator_name
     FROM refueling_records r
     LEFT JOIN stations s ON s.id = r.station_id
     LEFT JOIN users u ON u.id = r.operator_id
     ORDER BY r.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

module.exports = { create, getByStation, getAll };
