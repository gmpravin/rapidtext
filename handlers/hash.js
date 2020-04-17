const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const hash = value => {
  return bcrypt.hashSync(value, salt);
};

module.exports = hash;
