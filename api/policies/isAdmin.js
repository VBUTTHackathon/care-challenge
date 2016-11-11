module.exports = function(req, res, next) {
  if (req.session.passport.user.isAdmin) {
    return next();
  }
  else{
    return res.redirect('/');
  }
};
