const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.query(
    `SELECT
       s.id, s.name, s.address, s.city, s.district,
       s.provider, s.latitude, s.longitude, s.created_at,
       JSON_ARRAYAGG(
         JSON_OBJECT(
           'id',           f.id,
           'type',         f.type,
           'price',        f.price,
           'stock_liters', f.stock_liters,
           'max_capacity', f.max_capacity
         )
       ) AS fuels
     FROM stations s
     LEFT JOIN fuels f ON f.station_id = s.id
     GROUP BY s.id
     ORDER BY s.name ASC`
  );
  return rows.map(r => ({
    ...r,
    fuels: r.fuels ? r.fuels.filter(f => f.id !== null) : []
  }));
};

const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT
       s.id, s.name, s.address, s.city, s.district,
       s.provider, s.latitude, s.longitude, s.created_at,
       JSON_ARRAYAGG(
         JSON_OBJECT(
           'id',           f.id,
           'type',         f.type,
           'price',        f.price,
           'stock_liters', f.stock_liters,
           'max_capacity', f.max_capacity
         )
       ) AS fuels
     FROM stations s
     LEFT JOIN fuels f ON f.station_id = s.id
     WHERE s.id = ?
     GROUP BY s.id`,
    [id]
  );
  if (!rows[0]) return null;
  return {
    ...rows[0],
    fuels: rows[0].fuels ? rows[0].fuels.filter(f => f.id !== null) : []
  };
};

const create = async ({ name, address, city, district, provider, latitude, longitude }) => {
  const [result] = await db.query(
    `INSERT INTO stations (name, address, city, district, provider, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, address, city || 'Maputo', district || null, provider || null, latitude || null, longitude || null]
  );
  return result.insertId;
};

module.exports = { getAll, getById, create };