const express = require('express');
const router = express.Router();
const { list, getOne, create } = require('../controllers/stationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', list);
router.get('/:id', getOne);
router.post('/', authMiddleware, create);

module.exports = router;