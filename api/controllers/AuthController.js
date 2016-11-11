/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function (req, res, next) {

    passport.authenticate('ldapauth', function (err, ldapUser, info) {
      if (err) {
        return next(err);
      }
      if (!ldapUser) {
        req.flash('error', info.message);
        return res.redirect('/login');
      }
      User.findOne({
          email: ldapUser.mail
        }).then(function (user) {
          if (!user) {
            return User.create({
              email: ldapUser.mail,
              firstName: ldapUser.givenName,
              lastName: ldapUser.sn
            });
          }
          return user;
        }).then(function (user) {
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            req.flash('success', {
              msg: 'Success! You are logged in.'
            });
            if(user.isAdmin){
              return res.redirect(req.session.returnTo || '/admin');
            } else {
              return res.redirect(req.session.returnTo || '/');
            }
          });
        })
    })(req, res, next);
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  }
};
