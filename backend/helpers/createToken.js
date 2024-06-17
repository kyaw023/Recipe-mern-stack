const jwt = require("jsonwebtoken");

const tokenExpired = 3 * 24 * 60 * 60;

module.exports = function createToken(_id) {
  return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
    expiresIn: tokenExpired,
  });
};
