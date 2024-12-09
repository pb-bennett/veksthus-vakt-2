// Error handling functions to reduce code in all functions that produce and catch errors

const errorThrowHandler = (message, statusCode) => {
  const error = new Error(message);
  error.code = statusCode;
  throw error;
};
const errorCatchHandler = (res, error) => {
  const errorCode = error.code || 500;
  const status = errorCode >= 500 ? 'error' : 'fail';
  const response = {
    status,
    statusCode: errorCode,
    data: {
      message: error.message,
    },
  };
  if (process.env.NODE_ENV === 'development') {
    response.data.stack = error.stack;
  }
  res.status(errorCode).json(response);
};

module.exports = { errorCatchHandler, errorThrowHandler };
