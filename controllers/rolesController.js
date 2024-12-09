const { Role } = require('../models');
const {
  errorThrowHandler,
  errorCatchHandler,
} = require('../utils/errorHandler');
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    if (roles.length === 0) {
      return errorThrowHandler('No roles found', 404);
    }
    res.status(200).json({ status: 'success', data: roles });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

module.exports = {
  getAllRoles,
};
