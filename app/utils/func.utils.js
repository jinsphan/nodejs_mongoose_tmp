var jwt = require("jsonwebtoken");
var { KEY_JWT_SECRET, HOST } = require("../../config");

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


const modifyUser = function (user){
  return  {
    ...user,
    avatar: `${HOST}/images/avatars/${user.avatar}`
  }
}

const curry = function (fn) {
  return (...pr) => {
      if (fn.length === 1) {
          fn(...pr);
      }
      else {
          
          return curry(fn.bind(null, ...pr));
      }
  }
}

module.exports = {
    _generateToken,
    modifyUser,
    curry
}
