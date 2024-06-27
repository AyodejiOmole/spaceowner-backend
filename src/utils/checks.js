const {User} = require('../models');

const checkIfEmailExists = async function (email) {
  let user = await User.findOne({ email: email, isDeleted: false });
  return user !== null;
};

module.exports = {
  checkIfEmailExists,
};