const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

const authRoutes      = require('./routes/authRoutes');
const stationRoutes   = require('./routes/stationRoutes');
const fuelRoutes      = require('./routes/fuelRoutes');
const refuelingRoutes = require('./routes/refuelingRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '⛽ FuelMap API está online.',
    version: '1.0.0',
    endpoints: {
      auth:       '/api/auth',
      stations:   '/api/stations',
      fuels:      '/api/fuels',
      refueling:  '/api/abastecimento'
    }
  });
});

app.use('/api/auth',          authRoutes);
app.use('/api/stations',      stationRoutes);
app.use('/api/fuels',         fuelRoutes);
app.use('/api/abastecimento', refuelingRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('❌ Erro global:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor FuelMap rodando em http://localhost:${PORT}`);
});

module.exports = app;