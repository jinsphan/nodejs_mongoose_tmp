var jwt = require("jsonwebtoken");
var { KEY_JWT_SECRET } = require("../../config");

const _generateToken = (user) => {
  var expiry = new Date();
  var timeLive = 24*60; // min
  expiry.setMinutes(expiry.getMinutes() + timeLive);
  
  delete user.hashed_password;
  return jwt.sign({
    ...user,
    exp: expiry.getTime(),
  }, KEY_JWT_SECRET);
}

module.exports = {
    _generateToken,
}