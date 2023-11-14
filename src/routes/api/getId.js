// src/routes/api/get.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
var MarkdownIt = require('markdown-it');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const id = req.params.id;
  const ext = req.params.ext;

  const params = req.params;
  const md = new MarkdownIt();

  logger.debug({ params }, 'Params returned');
  try {
    const fragment = await Fragment.byId(req.user, id);

    var fragmentData = await fragment.getData();

    if (ext === 'html') {
      fragmentData = md.render(fragmentData.toString());
      logger.debug('Conversion Result');
    }

    logger.debug(fragmentData, 'GET :id - FragmentData returned');
    res
      .status(200)
      .json(createSuccessResponse({ fragmentData: fragmentData, fragmentType: fragment.type }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment does not exist', err));
  }
};
