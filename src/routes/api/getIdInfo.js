// src/routes/api/getIdInfo.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const id = req.params.id;
  try {
    const fragmentMetadata = await Fragment.byId(req.user, id);

    logger.debug(fragmentMetadata, 'GET :id/info - Fragment Metadata returned');

    res.status(200).json(createSuccessResponse({ fragmentMetadata: fragmentMetadata }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment does not exist', err));
  }
};
