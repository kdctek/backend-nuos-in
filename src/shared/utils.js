const NodeEnv = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

const isNull = (val) => val === null;

const isUndefined = (obj) => typeof obj === 'undefined';

const isNil = (val) => val === '';

const isEmpty = (val) => isUndefined(val) || isNull(val) || isNil(val);

const isBoolean = (obj) => typeof obj === 'boolean';

const getOsEnv = (key) => {
  const { env } = process;
  if (isEmpty(env[key])) {
    throw new Error(`[ENV] ${key} is not set.`.bgRed);
  }
  return env[key];
};

const getOsEnvOptional = (key) => process.env[key];

const toNumber = (val) => Number.parseInt(val, 10);

const toInteger = (val) => {
  if (Number.isNaN(Number.parseInt(val, 10))) {
    return 0;
  }
  return Number.parseInt(val, 10);
};

const toBool = (val) => {
  if (val === true || val === 'true') {
    return true;
  }
  if (val === false || val === 'false') {
    return false;
  }
  throw new Error('Parse failed (boolean string is expected)');
};

const isValidInt = (val) => toInteger(val) !== 0;

const normalizePort = (port) => {
  const parsedPort = toNumber(port);
  if (Number.isNaN(parsedPort)) {
    return port;
  }
  if (parsedPort >= 0) {
    return parsedPort;
  }
  return false;
};

const isObject = (fn) => !isEmpty(fn) && typeof fn === 'object';

const isFunction = (val) => typeof val === 'function';

const isString = (val) => typeof val === 'string';

const isNumber = (val) => typeof val === 'number';

const isConstructor = (val) => val === 'constructor';

const generateRandomNumber = () => {
  const minm = 100000;
  const maxm = 999999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
};

function slugify(text) {
  return text
    .toString() // Ensure the input is a string
    .toLowerCase() // Convert the string to lowercase
    .normalize('NFD') // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim() // Trim leading and trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/&/g, '-and-') // Replace '&' with '-and-'
    .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, '-'); // Replace consecutive hyphens with a single hyphen
}
module.exports = {
  NodeEnv,
  getOsEnv,
  getOsEnvOptional,
  isConstructor,
  isEmpty,
  isFunction,
  isNil,
  isNull,
  isNumber,
  isBoolean,
  isObject,
  isString,
  isUndefined,
  toInteger,
  isValidInt,
  toBool,
  toNumber,
  normalizePort,
  generateRandomNumber,
  slugify,
};
