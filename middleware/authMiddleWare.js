const jwt = require('jsonwebtoken');
const { User } = require('../models');

const {
  errorCatchHandler,
  errorThrowHandler,
} = require('../utils/errorHandler');

const authMiddleWare = async (req, res, next) => {
  try {
    console.log(req.body);
    const authHeader = req.headers.authorization;
    if (!authHeader)
      errorThrowHandler(
        'Restricted route.  Authorization header missing.',
        401
      );
    const token = authHeader?.split(' ')[1] ?? null;
    if (!token)
      errorThrowHandler('Restricted route. No JWT token found', 401);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await User.findByPk(decodedToken.userId);
    if (!userData) errorThrowHandler('User not found', 404);
    if (userData.email !== decodedToken.email)
      errorThrowHandler('User does not match token data', 404);
    req.user = decodedToken;
    next();
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

module.exports = { authMiddleWare };
