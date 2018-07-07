const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
// const userServices  = require("../components/users/users.Services");
const User = mongoose.model('User');
const { wrap: async } = require("co");

module.exports = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
  (username, password, done) => {
    if (username === "" || password === "") return done(new Error("Empty form!"));
    const options = {
      criteria: {
        username: username,
      },
      select: "username hashed_password fullname avatar role",
    }

    return User.load(options, async(function* (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }

      const isAuth = yield user.authenticate(password);

      if (!isAuth) {
        return done(null, false, { message: "Invalid password" });
      }

      return done(null, user.toJSON());
    }))
  }
);
