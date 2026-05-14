const express = require('express');
const router = express.Router();
const { create, listByStation, listAll } = require('../controllers/refuelingController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, listAll);
router.get('/station/:stationId', authMiddleware, listByStation);
router.post('/', authMiddleware, create);

module.exports = router;
