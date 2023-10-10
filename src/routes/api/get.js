// src/routes/api/get.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragments = await Fragment.byUser(req.user, false);
  logger.debug(fragments, 'FRAGMENTS RETURNED');
  res.status(200).json(createSuccessResponse({ fragments: fragments }));
};
