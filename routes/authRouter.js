const express = require('express');

const {
  loginUser,
  tokenCheck,
} = require('../controllers/authController');

const router = express.Router();

router
  .get('/', (req, res) => {
    res.json({ success: true });
  })
  .post('/login', loginUser)
  .get('/validate-token', tokenCheck);
module.exports = router;
