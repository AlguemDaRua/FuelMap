const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  console.log('🌱 A executar seed da base de dados...');

  const passwordHash = await bcrypt.hash('admin123', 12);

  await db.query(
    `INSERT IGNORE INTO users (id, name, email, password_hash, role)
     VALUES (1, 'Administrador FuelMap', 'admin@fuelmap.co.mz', ?, 'admin')`,
    [passwordHash]
  );
  console.log('✅ Admin criado: admin@fuelmap.co.mz / admin123');

  await db.query(
    `INSERT IGNORE INTO stations (id, name, address, city, district, provider, latitude, longitude)
     VALUES
       (1, 'Petromoc — Av. Julius Nyerere', 'Av. Julius Nyerere, 1234', 'Maputo', 'Sommerschield', 'petromoc', -25.9625, 32.5832),
       (2, 'Galp — Av. Eduardo Mondlane',   'Av. Eduardo Mondlane, 567', 'Maputo', 'Alto Maé',      'galp',     -25.9669, 32.5857)`
  );
  console.log('✅ 2 postos criados em Maputo');

  await db.query(
    `INSERT IGNORE INTO fuels (station_id, type, price, stock_liters, max_capacity)
     VALUES
       (1, 'Gasolina', 89.50,  8400, 15000),
       (1, 'Gasóleo',  75.00, 12100, 20000),
       (2, 'Gasolina', 89.50,   900, 15000),
       (2, 'Gasóleo',  75.00,  5200, 20000),
       (2, 'GPL',      45.00,   200,  5000)`
  );
  console.log('✅ Stocks iniciais definidos');

  console.log('🎉 Seed concluído com sucesso!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Erro no seed:', err.message);
  process.exit(1);
});
