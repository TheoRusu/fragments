// src/routes/api/get.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
var MarkdownIt = require('markdown-it');

/**
 * Get the fragment data for a specific fragment
 */
module.exports = async (req, res) => {
  const id = req.params.id;
  const ext = req.params.ext;

  const md = new MarkdownIt();

  try {
    const fragment = await Fragment.byId(req.user, id);

    var fragmentData = await fragment.getData();

    if (ext === 'html') {
      fragmentData = md.render(fragmentData.toString());
      logger.debug('Conversion Result');
    } else {
      fragmentData = fragmentData.toString();
    }

    res.writeHead(200, { 'Content-Type': fragment.type, 'Content-Length': fragment.size });

    logger.debug(fragmentData, 'GET :id - FragmentData returned');

    res.write(fragmentData);
    res.end();

    // res
    //   .status(200)
    //   .json(createSuccessResponse({ fragmentData: fragmentData, fragmentType: fragment.type }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment does not exist', err));
  }
};
