const { HttpStatus } = require('../../../constants');
const { NotFoundException, BadRequestException } = require('../../../errors');
const { asyncHandler } = require('../../../middleware');
const { Customer } = require('../../../models');
const { queryService } = require('../../../services');
const { logger } = require('../../../shared');

/**
  @desc   Fetch customers
  @method POST
  @route  /api/v1/organisation/customer
  @access Public
*/
exports.registerCustomer = asyncHandler(async (req, res, _) => {
  const { firstName, lastName, email, password, phoneNumber, organisationId } =
    req.body;
  const customer = await Customer.findOne({ email });
  if (customer) {
    throw new BadRequestException('Customer already exists!');
  }
  const newCustomer = await Customer.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    organisation: organisationId,
  });
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Customer registered successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Customer registered Successfully!',
    data: newCustomer,
  });
});

/**
  @desc   Fetch customers
  @param  { page, limit }
  @method GET
  @route  /api/v1/organisation/customer/:organisationId
  @access Private
  @role   Admin
*/
exports.getAllCustomerByOrgHandler = asyncHandler(async (req, res, _) => {
  const { organisationId } = req.params;
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.sort = 'createdAt';
  query.fields = 'firstName,lastName,email,organisation,createdAt,updatedAt';
  const features = new queryService.APIFeatures(
    Customer.find({ organisation: organisationId }).populate('organisation'),
    query || {},
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const customers = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch customers successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch customers Successfully!',
    data: customers,
  });
});

/**
  @desc   Fetch customers
  @param  { page, limit }
  @method GET
  @route  /api/v1/organisation/customer
  @access Private
  @role   Admin
*/
exports.getAllCustomerHandler = asyncHandler(async (req, res, _) => {
  const query = { ...req.query };
  query.page = +query.page || 1;
  query.limit = +query.limit || 10;
  query.sort = 'createdAt';
  query.fields = 'firstName,lastName,email,organisation,createdAt,updatedAt';
  const features = new queryService.APIFeatures(Customer.find(), query || {})
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const customers = await features.query;
  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch customers successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch customers Successfully!',
    data: customers,
  });
});

/**
  @desc   Fetch customer by id
  @param  { id }
  @method GET
  @route  /api/v1/organisation/customer/:id
  @access Private
  @role   Admin
*/
exports.getCustomerByIdHandler = asyncHandler(async (req, res, _) => {
  const customer = await Customer.findOne({ _id: req.params.id });

  if (!customer) {
    throw new NotFoundException('Customer not found!');
  }

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Fetch customer successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Fetch customer Successfully!',
    data: customer,
  });
});

/**
  @desc   Update customer by id
  @param  { id }
  @method PUT
  @route  /api/v1/organisation/customer/:id
  @access Private
  @role   Admin
*/
exports.updateCustomerHandler = asyncHandler(async (req, res, _) => {
  const customer = await Customer.findOne({ _id: req.params.id });
  const { firstName, lastName, email, phoneNumber } = req.body;

  if (!customer) {
    throw new NotFoundException('Customer not found!');
  }

  // if (req.file) customer.photo = req.file.filename;
  const updatedDetails = await Customer.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    },
    { new: true },
  );

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Updated customer successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Updated customer Successfully!',
    data: updatedDetails,
  });
});

/**
  @desc   Delete customer by id
  @param  { id }
  @method DELETE
  @route  /api/v1/organisation/customer/:id
  @access Private
  @role   Admin
*/
exports.deleteCustomerHandler = asyncHandler(async (req, res, _) => {
  const customer = await Customer.findOne({ _id: req.params.id });

  if (!customer) {
    throw new NotFoundException('Customer not found!');
  }

  await Customer.findOneAndDelete({ _id: req.params.id });

  logger.info(
    `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Customer deleted successfully!' `,
  );
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Customer deleted successfully!',
    data: customer,
  });
});
