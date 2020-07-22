const passport = require("passport");
const User = require("../models/user");
const { badRequest, internalServerError } = require("./controller-utils");
const authenticate = passport.authenticate("local");
// helper function

function loginUser(req, res) {
  try {
    // authenticate(req, res, function (err, result) {
    authenticate(req, res, function (err) {
      if (err) {
        return;
      }
      // See what we have
      // console.log("authenticated", req.user.username);
      // console.log("session object:", req.session);
      // console.log("req.user:", req.user);
      // console.log(result);
      // send back the user
      const { username, email, role } = req.user;
      res.json({ username, email, role });
    });
  } catch (err) {
    internalServerError(req, res, err);
  }
}

const register = function (req, res) {
  try {
    const { username, password, email, role } = req.body;
    User.register(
      new User({
        username,
        email,
        role,
      }),
      password,
      function (err) {
        if (err) {
          if (err.name === "UserExistsError") {
            res.status(409).json({
              errMsg: err.message,
            });
          } else {
            badRequest(req, res, err);
          }
        }
        loginUser(req, res);
      }
    );
  } catch (err) {
    internalServerError(req, res, err);
  }
};

const logout = function (req, res) {
  try {
    // console.log(`logging out user ${req.user}`);
    req.logout();
    // console.log("session object:", req.session);
    // console.log("req.user:", req.user);
    res.sendStatus(200);
  } catch (err) {
    internalServerError(req, res, err);
  }
};

module.exports = { register, login: loginUser, logout };
