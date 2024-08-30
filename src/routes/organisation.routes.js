const organisationRouter = require('express').Router();

const {
  Routes: { ORGANISATION },
  UserRoles: { SUPER_ADMIN, ADMIN, ORG_ADMIN },
} = require('../constants');

const {
  organisationController: {
    listOrganisations,
    updateOrganisationDetails,
    getOrganisationDetails,
    deleteOrganisation,
  },
} = require('../controller');

const { verifyToken, restrictTo } = require('../middleware');

organisationRouter.get(
  '/list_organisations',
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN),
  listOrganisations,
);

organisationRouter.get(
  ORGANISATION.DETAIL,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN),
  getOrganisationDetails,
);

organisationRouter.patch(
  ORGANISATION.DETAIL,
  verifyToken,
  restrictTo(ORG_ADMIN),
  updateOrganisationDetails,
);

organisationRouter.delete(
  ORGANISATION.DETAIL,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN),
  deleteOrganisation,
);

module.exports = { organisationRouter };
