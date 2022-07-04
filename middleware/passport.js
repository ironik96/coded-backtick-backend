const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy,
ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const User = require("../models/User");
const bcrypt = require("bcrypt");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.JWT_SECRET;

exports.jwtStrategy = new JwtStrategy(opts, async (jwtPayLoad, done) => {
  if (Date.now() > jwtPayLoad.expires) {
    return done(null, false);
  }
  try {
    const user = await User.findById(jwtPayLoad._id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
exports.localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      let passwordsMatched = bcrypt.compareSync(password, user.password);
      passwordsMatched ? done(null, user) : done(null, false);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error);
  }
});
