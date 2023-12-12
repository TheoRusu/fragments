const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Creates a new fragment for the current user
 */
module.exports = async (req, res) => {
  // const { type } = contentType.parse(req);
  const type = req.get('Content-Type');
  if (!Fragment.isSupportedType(type)) {
    return res.status(415).json(createErrorResponse(415, 'Unsupported content type'));
  }

  try {
    const fragment = new Fragment({
      ownerId: req.user,
      type: type,
      size: Buffer.byteLength(req.body),
    });

    await fragment.setData(req.body);

    fragment.save();

    logger.debug({ fragment }, 'POST - Fragment saved');

    const url = process.env.API_URL || `http://${req.headers.host}`;
    const fragmentURL = new URL(`/v1/fragments/${fragment.id}`, url);

    res.setHeader('location', fragmentURL);

    logger.info('Fragment is saved at: ' + fragmentURL);

    return res.status(201).json(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    logger.error({ err }, 'Unable to create new fragment');
    res.status(400).json(createErrorResponse(400, err.message));
  }
};
