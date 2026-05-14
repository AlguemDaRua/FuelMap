const Fuel = require('../models/fuelModel');

const getStock = async (req, res) => {
  try {
    const fuels = await Fuel.getByStation(req.params.stationId);
    return res.status(200).json({ fuels });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao obter stock.', details: err.message });
  }
};

const updateStock = async (req, res) => {
  const { id } = req.params;
  const { stock_liters, price } = req.body;

  if (stock_liters === undefined && price === undefined) {
    return res.status(400).json({ error: 'Forneça pelo menos stock_liters ou price para actualizar.' });
  }

  if (stock_liters !== undefined && (isNaN(stock_liters) || stock_liters < 0)) {
    return res.status(400).json({ error: 'stock_liters deve ser um número não-negativo.' });
  }

  try {
    const fuel = await Fuel.getById(id);
    if (!fuel) {
      return res.status(404).json({ error: 'Combustível não encontrado.' });
    }

    await Fuel.updateStock(id, { stock_liters, price });
    const updated = await Fuel.getById(id);

    return res.status(200).json({ message: 'Stock actualizado com sucesso.', fuel: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao actualizar stock.', details: err.message });
  }
};

const addFuel = async (req, res) => {
  const { station_id, type, price, stock_liters, max_capacity } = req.body;

  if (!station_id || !type) {
    return res.status(400).json({ error: 'station_id e type são obrigatórios.' });
  }

  try {
    await Fuel.createFuel({ station_id, type, price, stock_liters, max_capacity });
    const fuels = await Fuel.getByStation(station_id);
    return res.status(201).json({ message: 'Combustível adicionado/actualizado.', fuels });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao adicionar combustível.', details: err.message });
  }
};

module.exports = { getStock, updateStock, addFuel };
