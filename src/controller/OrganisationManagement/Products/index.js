const { HttpStatus } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger, slugify } = require('../../../shared');
const { Product } = require('../../../models');

exports.addProduct = asyncHandler(async (req, res, _) => {
  const { organisation } = req.user;
  const { name, description, user } = req.body;
  const slug = slugify(name);
  const newProduct = await Product.create({
    name,
    slug,
    description,
    user,
    organisation: organisation.toString(),
  });

  if (newProduct) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Products created successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Products created successfully!',
      data: newProduct,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.listProducts = asyncHandler(async (req, res, _) => {
  const products = await Product.find().populate('user');

  if (products) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Products fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Products fetched successfully!',
      data: products,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.listProductsByOrg = asyncHandler(async (req, res, _) => {
  const { organisationId } = req.params;
  const products = await Product.find({ organistion: organisationId }).populate(
    'user',
  );

  if (products) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Products fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Products fetched successfully!',
      data: products,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.updateProduct = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const {
    platform_id,
    name,
    slug,
    description,
    subscription_id,
    groups,
    settings,
  } = req.body;
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id },
    {
      platform_id,
      name,
      slug,
      description,
      subscription_id,
      groups,
      settings,
    },
    {
      new: true,
    },
  );

  if (updatedProduct) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Product updated successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Product updated successfully!',
      data: updatedProduct,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});

exports.listProductsById = asyncHandler(async (req, res, _) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id }).populate('user');

  if (product) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Product fetched successfully!' `,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Product fetched successfully!',
      data: product,
    });
  }
  return res.status(HttpStatus.BAD_REQUEST).json({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Something went wrong!',
  });
});
