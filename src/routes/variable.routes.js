const variableRouter = require('express').Router();

const {
  Routes: {
    PARTICLE: { VARIABLE },
  },
} = require('../constants');

const {
  variableController: {
    addVariable,
    listVariables,
    listVariablesById,
    updateVariable,
    deleteVariable,
  },
} = require('../controller');

const { verifyToken } = require('../middleware');
// const {
//   productValidations: { validateAddProduct, validateUpdateProduct },
// } = require('../validations');

variableRouter.post(VARIABLE.DEFAULT, verifyToken, addVariable);
variableRouter.patch(VARIABLE.DETAILS, verifyToken, updateVariable);
variableRouter.get(VARIABLE.DEFAULT, verifyToken, listVariables);
variableRouter.get(VARIABLE.DETAILS, verifyToken, listVariablesById);
variableRouter.delete(VARIABLE.DETAILS, verifyToken, deleteVariable);

module.exports = { variableRouter };
