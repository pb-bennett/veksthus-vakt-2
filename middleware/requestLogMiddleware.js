const { RequestLog } = require('../models');

const logRequest = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') return next();
    console.log('Logging request...');
    await RequestLog.create({
      user_id: req.user ? req.user.user_id : null,
      ip_address: req.ip, // After trusting the proxy, this will give the correct client IP
      request_type: req.method,
      endpoint: req.originalUrl,
      request_body: JSON.stringify(req.body),
    });
  } catch (error) {
    console.error('Error logging request:', error);
  }
  next();
};

module.exports = logRequest;
