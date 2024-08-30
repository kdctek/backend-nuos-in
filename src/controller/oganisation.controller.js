/* eslint-disable no-unused-expressions */
const { Organisation } = require('../models');
const { HttpStatus } = require('../constants');
const { asyncHandler } = require('../middleware');
const { logger } = require('../shared');
const { NotFoundException } = require('../errors');

exports.listOrganisations = asyncHandler(async (req, res, _) => {
  const organisations = await Organisation.find();

  if (organisations) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Organisations fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Organisations fetched successfully!',
      data: organisations,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});

exports.getOrganisationDetails = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const organisations = await Organisation.find({ _id: id });

  if (organisations) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Organisation fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Organisation fetched successfully!',
      data: organisations,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});

exports.updateOrganisationDetails = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const { name } = req.body;
  const updatedOrganisation = await Organisation.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name,
      },
    },
    { new: true },
  );

  if (updatedOrganisation) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Organisation updated successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Organisation updated successfully!',
      data: updatedOrganisation,
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});

exports.deleteOrganisation = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const organisation = await Organisation.findOne({ _id: id });

  if (!organisation) {
    throw new NotFoundException('Organisation not found!');
  }
  const result = await Organisation.findOneAndDelete({ _id: id });

  if (result) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Organisation deleted successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Organisation deleted successfully!',
    });
  }

  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
  });
});
