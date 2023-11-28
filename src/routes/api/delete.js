const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  const id = req.params.id;

  try {
    await Fragment.delete(req.user, id);

    res.status(200).json(createSuccessResponse());
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Fragment does not exist', err));
  }
};
