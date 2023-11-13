// src/routes/api/get.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const id = req.params.id;
  try {
    const fragment = await Fragment.byId(req.user, id);

    const fragmentData = await fragment.getData();

    logger.debug(fragmentData, 'GET :id - FragmentData returned');

    res
      .status(200)
      .json(createSuccessResponse({ fragmentData: fragmentData, fragmentType: fragment.type }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment does not exist', err));
  }
};
