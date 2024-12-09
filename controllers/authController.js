const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const { User, Unit, UserUnit, Role } = require('../models');
const {
  errorCatchHandler,
  errorThrowHandler,
} = require('../utils/errorHandler');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({
      where: { email },
      include: [
        {
          model: Unit,
          through: {
            model: UserUnit,
            attributes: ['role'], // Include any relevant fields from UserUnit
          },
          attributes: ['unit_id'], // Keep snake_case here for the query
        },
        {
          model: Role, // Include Role to get role information
          attributes: ['role_id', 'role_name'], // Return role_id and role_name
        },
      ],
    });
    if (!findUser) {
      return errorThrowHandler('Invalid email or password', 401);
    }
    const passwordCheck = await argon2.verify(
      findUser.password_hashed,
      password
    );
    if (!passwordCheck) {
      return errorThrowHandler('Invalid email or password', 401);
    }

    // Return user data
    const userData = {
      userId: findUser.user_id,
      username: findUser.username,
      email: findUser.email,
      role: findUser.Role.role_name,
      units: findUser.Units.map((unit) => {
        return {
          unitId: unit.unit_id,

          role: unit.UserUnit.role,
        };
      }),
    };
    const token = jwt.sign({ ...userData }, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    res
      .status(200)
      .json({ status: 'success', data: { token, userData } });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

const tokenCheck = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] ?? null;
    if (!token) {
      throw new Error('No token provided');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ status: 'success', data: decodedToken });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

module.exports = {
  loginUser,
  tokenCheck,
};
