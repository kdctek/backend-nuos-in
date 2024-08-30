const { UserRoles } = require('../constants');
const { User } = require('../models');

const seedDB = async () => {
  const superAdmin = await User.findOne({ email: 'superadmin@nuos.in' }, [
    '_id',
  ]);
  if (!superAdmin) {
    await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@nuos.in',
      password: 'superadmin@12345',
      role: UserRoles.SUPER_ADMIN,
    });
  }
};

module.exports = { seedDB };
