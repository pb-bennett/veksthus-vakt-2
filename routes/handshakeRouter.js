const express = require('express');
const router = express.Router();
const { authMiddleWare } = require('../middleware/authMiddleWare');

const {
  makeHandshake,
} = require('../controllers/handshakeController');

router.use(authMiddleWare).get('/:id', makeHandshake);

module.exports = router;
