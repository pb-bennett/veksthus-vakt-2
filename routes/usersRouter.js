const express = require('express');

const { authMiddleWare } = require('../middleware/authMiddleWare');
const {
  validateUser,
  validateUserUnit,
} = require('../middleware/validationMiddleware');
const {
  createUser,
  addUnitToUser,
  getAllUsers,
} = require('../controllers/usersController');

const router = express.Router();

router.use(authMiddleWare);
// Auth middleware applied to all routes
router
  .get('/', getAllUsers)
  .post('/', validateUser, createUser)
  .post('/units', validateUserUnit, addUnitToUser); // Unit adding route

module.exports = router;
