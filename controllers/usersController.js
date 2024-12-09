const argon2 = require('argon2');

const { User, UserUnit } = require('../models');
const {
  errorCatchHandler,
  errorThrowHandler,
} = require('../utils/errorHandler');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return errorThrowHandler('No users found', 404);
    }
    const resData = users.map((user) => ({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role_id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
    res.status(200).json({ stats: 'success', data: resData });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};
const createUser = async (req, res) => {
  try {
    console.log(req.user);
    if (req.user.role !== 'super') {
      errorThrowHandler(
        'Denied: Only super users can add new users',
        401
      );
    }
    const existingUser = await User.findAll({
      where: { email: req.body.email },
    });

    if (existingUser.length > 0) {
      errorThrowHandler('Email already in use', 409);
    }
    const user = req.body;
    const hashedPassword = await argon2.hash(user.password);
    const newUser = await User.create({
      username: user.username,
      email: user.email,
      password_hashed: hashedPassword,
      role_id: user.roleId,
    });
    res.status(201).json(user);
  } catch (error) {
    errorCatchHandler(res, error);
  }
};
const addUnitToUser = async (req, res) => {
  try {
    if (req.user.role !== 'super') {
      errorThrowHandler(
        'Denied: Only super users can associate users to units',
        401
      );
    }
    const { unitId, userId, role } = req.body;
    const checkUnitExists = await UserUnit.findOne({
      where: { user_id: userId, unit_id: unitId, role },
    });
    if (checkUnitExists) {
      errorThrowHandler(
        'Unit already associated with user in that role',
        409
      );
    }

    // const newUserUnit = await UserUnit.create({
    //   user_id: userId,
    //   unit_id: unitId,
    //   role,
    // });
    res.status(201).json({ status: 'success', data: req.body });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

module.exports = {
  createUser,
  addUnitToUser,
  getAllUsers,
};
