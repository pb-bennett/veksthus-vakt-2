const { RequestLog } = require('../models');
const {
  errorThrowHandler,
  errorCatchHandler,
} = require('../utils/errorHandler');

// Function to censor email (showing only the first and last letter)
const censorIP = (ipAddress) => {
  // console.log(ipAddress);
  if (!ipAddress) return 'Unknown';
  const censoredIP = `${ipAddress.split('.')[0]}.${
    ipAddress.split('.')[1]
  }.***.***`;
  return censoredIP;
};

const censorEmail = (email) => {
  if (!email.includes('@')) return email; // Return as-is if not a valid email
  const [localPart, domain] = email.split('@'); // Split into local and domain parts

  const censor = (str) => {
    if (str.length <= 2) return str[0] + '*'; // Handle very short strings
    return `${str[0]}***${str[str.length - 1]}`; // First and last letters with ***
  };

  return `${censor(localPart)}@${censor(domain)}`;
};

// Function to censor password
const censorPassword = (password) => {
  if (!password) return '*****'; // Default censor for missing or empty passwords
  return '*****'; // Always return a generic string for password
};

// Function to censor API key
const censorApiKey = (apiKey) => {
  if (!apiKey) return '*****'; // Default censor for missing API keys
  return '*****'; // Always return a generic string for API key
};

// Function to censor sensitive data in request body (like email, password, apiKey)
const censorRequestBody = (requestBody) => {
  try {
    const parsedBody = JSON.parse(requestBody);

    // Traverse the object to censor email, password, and apiKey fields
    for (const key in parsedBody) {
      if (typeof parsedBody[key] === 'string') {
        if (parsedBody[key].includes('@')) {
          // Censor email
          parsedBody[key] = censorEmail(parsedBody[key]);
        } else if (key.toLowerCase().includes('password')) {
          // Censor password
          parsedBody[key] = censorPassword(parsedBody[key]);
        } else if (key.toLowerCase() === 'apikey') {
          // Censor API key
          parsedBody[key] = censorApiKey(parsedBody[key]);
        }
      }
    }
    return JSON.stringify(parsedBody); // Return the censored JSON as a string
  } catch (error) {
    console.error('Error parsing request body:', error.message);
    return requestBody; // Return the original body if parsing fails
  }
};

// Controller to get all request logs and censor sensitive data
const getAllRequestLogs = async (req, res) => {
  try {
    const requestLogs = await RequestLog.findAll({
      order: [['request_id', 'DESC']],
    });
    if (requestLogs.length === 0) {
      return errorThrowHandler('No request logs found', 404);
    }

    // Censor data for each request log
    const censoredLogs = requestLogs.map((log, index) => {
      // Censor email, password, apiKey, and other sensitive fields in the request body
      const censoredRequestBody = censorRequestBody(log.request_body);
      if (index < 4) {
        console.log(log.ip_address);
      }
      // Censor IP address (show only the first part of the IP)

      const censoredIpAddress = censorIP(log.ip_address);
      if (index < 4) {
        console.log(censoredIpAddress);
      }
      return {
        ...log.toJSON(),
        request_body: censoredRequestBody,
        ip_address: censoredIpAddress,
      };
    });

    res.status(200).json({
      status: 'success',
      data: censoredLogs,
    });
  } catch (error) {
    errorCatchHandler(res, error);
  }
};

module.exports = {
  getAllRequestLogs,
};
