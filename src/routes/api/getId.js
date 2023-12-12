// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const path = require('path');

/**
 * Get the fragment data for a specific fragment
 */
module.exports = async (req, res) => {
  try {
    // const ownerId = req.user;
    const id = path.parse(req.params.id).name;
    const ext = path.parse(req.params.id).ext.slice(1);

    const fragment = new Fragment(await Fragment.byId(req.user, id));
    const fragmentData = await fragment.getData();

    if (ext) {
      const type = await Fragment.isValidExtType(ext);

      const newFragmentData = await fragment.convertFragment(fragmentData, type);

      res.setHeader('Content-Type', type);
      res.status(200).send(newFragmentData);
      return;
    }
    res.setHeader('content-type', fragment.type);
    res.status(200).send(fragmentData);
    return;
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err.message));
  }
  // const id = req.params.id;
  // const ext = req.params.ext;

  // const md = new MarkdownIt();

  // try {
  //   const fragment = await Fragment.byId(req.user, id);

  //   var fragmentData = await fragment.getData();

  //   if (ext === 'html') {
  //     fragmentData = md.render(fragmentData.toString());
  //     logger.debug('Conversion Result');
  //   } else {
  //     fragmentData = fragmentData.toString();
  //   }

  //   res.writeHead(200, { 'Content-Type': fragment.type, 'Content-Length': fragment.size });

  //   logger.debug(fragmentData, 'GET :id - FragmentData returned');

  //   res.write(fragmentData);
  //   res.end();

  //   // res
  //   //   .status(200)
  //   //   .json(createSuccessResponse({ fragmentData: fragmentData, fragmentType: fragment.type }));
  // } catch (err) {
  //   res.status(404).json(createErrorResponse(404, 'Fragment does not exist', err));
  // }
};
