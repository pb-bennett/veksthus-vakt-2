const express = require('express');

const {
  getAllUnits,
  createUnit,
} = require('../controllers/unitsController');
const { authMiddleWare } = require('../middleware/authMiddleWare');

const router = express.Router();

router
  .use(authMiddleWare)
  .get('/', getAllUnits)
  .post('/', createUnit);
module.exports = router;
