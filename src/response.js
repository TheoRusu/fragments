module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    // TODO ...
    ...data,
  };
};

module.exports.createErrorResponse = function (code, message) {
  // TODO ...
  return {
    status: 'error',
    error: {
      code,
      message,
    },
  };
};
