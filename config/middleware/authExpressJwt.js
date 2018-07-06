var expressJwt = require("express-jwt");
var { KEY_JWT_SECRET } = require("../index");

var auth = expressJwt({
  secret: KEY_JWT_SECRET,
  userProperty: "userAuth"
})

module.exports = auth;