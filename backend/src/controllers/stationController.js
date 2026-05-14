const Station = require('../models/stationModel');

const list = async (req, res) => {
  try {
    const stations = await Station.getAll();
    return res.status(200).json({ stations });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao obter postos.', details: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const station = await Station.getById(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Posto não encontrado.' });
    }
    return res.status(200).json({ station });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao obter posto.', details: err.message });
  }
};

const create = async (req, res) => {
  const { name, address, city, district, provider, latitude, longitude } = req.body;

  if (!name || !address) {
    return res.status(400).json({ error: 'Nome e morada são obrigatórios.' });
  }

  try {
    const id = await Station.create({ name, address, city, district, provider, latitude, longitude });
    const station = await Station.getById(id);
    return res.status(201).json({ message: 'Posto criado com sucesso.', station });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar posto.', details: err.message });
  }
};

module.exports = { list, getOne, create };