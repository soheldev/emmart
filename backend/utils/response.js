// backend/utils/response.js
exports.successResponse = (message, data) => ({
  success: true,
  message,
  data
});
