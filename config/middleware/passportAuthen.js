const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
// const userServices  = require("../components/users/users.Services");
const User = mongoose.model('User');

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

    return User.load(options, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      return user.authenticate(password)
        .then(() => {
          return done(null, user.toJSON());
        })
        .catch(err => {
          done(null, false, err);
        })
    })
  }
);
