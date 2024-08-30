const { HttpStatus } = require('../constants');
const { asyncHandler } = require('../middleware');
const { logger } = require('../shared');
const { Variables } = require('../models');

exports.addVariable = asyncHandler(async (req, res, _) => {
  const { name, value, info } = req.body;

  const newVariable = await Variables.create({ name, value, info });

  if (newVariable) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Variable created successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Variable created successfully!',
      data: newVariable,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.listVariables = asyncHandler(async (req, res, _) => {
  const variables = await Variables.find();

  if (variables) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Variables fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Variables fetched successfully!',
      data: variables,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.updateVariable = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const { name, value, info } = req.body;
  const updatedVariable = await Variables.findOneAndUpdate(
    { _id: id },
    {
      name,
      value,
      info,
    },
    {
      new: true,
    },
  );

  if (updatedVariable) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Variable updated successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Variable updated successfully!',
      data: updatedVariable,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.listVariablesById = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const variable = await Variables.findOne({ _id: id });

  if (variable) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Variables fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Variables fetched successfully!',
      data: variable,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.deleteVariable = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const variable = await Variables.findOneAndDelete({ _id: id });

  if (variable) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Variables deleted successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Variables deleted successfully!',
      data: variable,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});
