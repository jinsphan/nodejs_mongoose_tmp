var notFound                  = require("./notFound");
var unAuthorized              = require("./unAuthorized");
var authExpressJwt            = require("./authExpressJwt");
var checkTokenExpiry          = require("./checkTokenExpiry");
var passportAuthen            = require("./passportAuthen");
var responseModified          = require("./responseModified");
var { adminAuth, ownersAuth } = require("./authorization");

module.exports = {
  notFound,
  unAuthorized,
  authExpressJwt,
  checkTokenExpiry,
  passportAuthen,
  responseModified,
  adminAuth,
  ownersAuth
}