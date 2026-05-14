const express = require('express');
const router = express.Router();
const { getStock, updateStock, addFuel } = require('../controllers/fuelController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/station/:stationId', getStock);
router.put('/:id', authMiddleware, updateStock);
router.post('/', authMiddleware, addFuel);

module.exports = router;
