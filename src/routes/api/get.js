const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    let fragments = {};
    if (req.query.expand == 1) {
      fragments = await Fragment.byUser(req.user, true);
    } else {
      fragments = await Fragment.byUser(req.user, false);
    }
    logger.debug({ fragments }, 'GET /fragments');
    res.status(200).json(createSuccessResponse({ fragments: fragments }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err.message));
  }
  // const expandQueryParam = req.query.expand;
  // // logger.debug(expandQueryParam, 'EXPAND QUERY PARAM');

  // let fragments = {};
  // if (expandQueryParam == 1) {
  //   fragments = await Fragment.byUser(req.user, true);
  // } else {
  //   fragments = await Fragment.byUser(req.user, false);
  // }
};
