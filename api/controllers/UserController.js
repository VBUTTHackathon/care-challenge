/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  users: function (req, res){
    return User.find()
          .then(function(users){
            res.json({data:users});
          });
  }
};

