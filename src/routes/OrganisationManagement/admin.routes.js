const manageOrganisationRouter = require('express').Router();

const {
  Routes: { ORGANISATION },
  UserRoles: { SUPER_ADMIN, ADMIN, ORG_ADMIN },
} = require('../../constants');

const {
  manageOrganisationController: {
    addOrgAdmin,
    getOrgAdmins,
    deleteOrgAdmins,
    updateOrgAdminDetails,
  },
} = require('../../controller');

const { verifyToken, restrictTo } = require('../../middleware');

manageOrganisationRouter.get(
  ORGANISATION.MANAGE_ORGANISATION.ADMIN,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN),
  getOrgAdmins,
);

manageOrganisationRouter.post(
  ORGANISATION.MANAGE_ORGANISATION.ADMIN,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN, ORG_ADMIN),
  addOrgAdmin,
);

manageOrganisationRouter.delete(
  `${ORGANISATION.MANAGE_ORGANISATION.ADMIN}/:id`,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN, ORG_ADMIN),
  deleteOrgAdmins,
);

manageOrganisationRouter.patch(
  `${ORGANISATION.MANAGE_ORGANISATION.ADMIN}/:id`,
  verifyToken,
  restrictTo(SUPER_ADMIN, ADMIN, ORG_ADMIN),
  updateOrgAdminDetails,
);

module.exports = { manageOrganisationRouter };
