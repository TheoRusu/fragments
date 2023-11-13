const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const expandQueryParam = req.query.expand;
  // logger.debug(expandQueryParam, 'EXPAND QUERY PARAM');

  let fragments = {};
  if (expandQueryParam == 1) {
    fragments = await Fragment.byUser(req.user, true);
  } else {
    fragments = await Fragment.byUser(req.user, false);
  }

  logger.debug(fragments, 'GET - Fragments array returned');
  res.status(200).json(createSuccessResponse({ fragments: fragments }));
};
