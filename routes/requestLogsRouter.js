const express = require('express');
const router = express.Router();

const { authMiddleWare } = require('../middleware/authMiddleWare');
const {
  getAllRequestLogs,
} = require('../controllers/requestLogsController');

router.use(authMiddleWare).get('/', getAllRequestLogs);

module.exports = router;
