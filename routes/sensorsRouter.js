const express = require('express');
const router = express.Router();

const { authMiddleWare } = require('../middleware/authMiddleWare');
const { getAllSensors } = require('../controllers/sensorsController');

router.use(authMiddleWare).get('/', getAllSensors);

module.exports = router;
