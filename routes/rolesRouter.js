const express = require('express');
const router = express.Router();

const { authMiddleWare } = require('../middleware/authMiddleWare');
const { getAllRoles } = require('../controllers/rolesController');

router.use(authMiddleWare).get('/', getAllRoles);

module.exports = router;
