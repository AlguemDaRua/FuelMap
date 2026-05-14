const Refueling = require('../models/refuelingModel');

const create = async (req, res) => {
  const { station_id, fuel_type, quantity, refuel_date, refuel_time, observations } = req.body;

  if (!station_id || !fuel_type || !quantity || !refuel_date || !refuel_time) {
    return res.status(400).json({
      error: 'station_id, fuel_type, quantity, refuel_date e refuel_time são obrigatórios.'
    });
  }

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'A quantidade deve ser um número positivo.' });
  }

  try {
    const id = await Refueling.create({
      station_id,
      fuel_type,
      quantity: parseInt(quantity, 10),
      operator_id: req.user ? req.user.id : null,
      refuel_date,
      refuel_time,
      observations
    });

    return res.status(201).json({
      message: 'Abastecimento registado com sucesso. Stock actualizado.',
      refueling_id: id
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao registar abastecimento.', details: err.message });
  }
};

const listByStation = async (req, res) => {
  try {
    const records = await Refueling.getByStation(req.params.stationId);
    return res.status(200).json({ records });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao obter histórico.', details: err.message });
  }
};

const listAll = async (req, res) => {
  try {
    const records = await Refueling.getAll();
    return res.status(200).json({ records });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao obter abastecimentos.', details: err.message });
  }
};

module.exports = { create, listByStation, listAll };
