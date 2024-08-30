const mongoose = require('mongoose');
const { HttpStatus, UserRoles } = require('../../../constants');
const { asyncHandler } = require('../../../middleware');
const { logger, slugify } = require('../../../shared');
const { Product } = require('../../../models');
const { NotFoundException } = require('../../../errors');

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
  if (req.user.role === UserRoles.SUPER_ADMIN) {
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
  }
  const products = await Product.find({
    organisation: req.user.organisation,
  }).populate('user');
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
  const products = await Product.find({
    organisation: mongoose.Types.ObjectId(organisationId),
  });

  if (products) {
    logger.info(
      `${HttpStatus.OK} - ${req.originalUrl} [${req.method}] - 'Products fetched successfully!' `,
    );
    console.log({ products });
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
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid product id',
    });
  }
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
  if (!updatedProduct) {
    throw new NotFoundException('Product not found!');
  }
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
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid product id',
    });
  }
  const product = await Product.findOne({ _id: id }).populate('user');

  if (!product) {
    throw new NotFoundException('Product not found!');
  }
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
