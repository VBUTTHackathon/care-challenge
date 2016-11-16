/**
 * DuoController
 *
 * @description :: Server-side logic for managing Duos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

<<<<<<< HEAD
module.exports = {
    duos:function(req, res) {
      //Duo.find().populate('user')
    }
};

=======
function getUserById(id) {
  return User.findOne(id)
    .then(function (user) {
      if (!user) {
        throw new CustomError("Could not find current user.");
      }
      return user;
    });
};

module.exports = {
  confirm: function (req, res) {
    var currUserId = req.user.id;
    return User.findOne(currUserId).populate('duo')
      .then(function (currUser) {
        currUser.state = "confirmed";
        return currUser.save()
          .then(function () {
            return Duo.findOne(currUser.duo).populate('picker');
          });
      }).then(function (duo) {
        var picker = duo.picker;
        picker.state = "confirmed";
        return picker.save()
          .then(function () {
            duo.state = "twosides";
            return duo.save();
          });
      }).then(function () {
        return res.json(200, {
          message: "You have confirmed your Duo partner."
        });
      });
  },
  cancel: function (req, res) {
    var currUserId = req.user.id;
    return User.findOne(currUserId).populate('duo')
      .then(function (currUser) {
        var duoId = currUser.duo.id;
        currUser.state = "none";
        currUser.duo = null;
        return currUser.save()
          .then(function () {
            return Duo.findOne(duoId).populate('picker');
          });
      }).then(function (duo) {
        var duoId = duo.id;
        var picker = duo.picker;
        picker.state = "none";
        picker.duo = null;
        return picker.save()
          .then(function () {
          console.log(duo);
            return  Duo.destroy(duo);
          });
      }).then(function () {
        return res.json(200, {
          message: "You have canceled your Duo partner."
        });
      });
  },
  pickPartner: function (req, res) {
    var partnerId = req.param('id');
    var currUserId = req.user.id;
    getUserById(currUserId)
      .then(function (currUser) {
        if (currUser.state === 'chose') {
          throw new CustomError("You have already picked your partner.");
        } else if (currUser.state === 'chosen') {
          throw new CustomError("You have been selected as a partner. In order to select another partner you have to cancel first.");
        } else if (currUser.state === 'confirmed') {
          throw new CustomError("Your Duo is confirmed, you can't change it now.");
        }
        return getUserById(partnerId)
          .then(function (partner) {
            if (partner.state !== 'none') {
              throw new CustomError("Your partner is already taken.");
            }
            return partner;
          }).then(function (partner) {
            return Duo.create({
                picker: currUserId,
                picked: partnerId
              })
              .then(function () {
                currUser.state = 'chose';
                return currUser.save();
              }).then(function () {
                partner.state = 'chosen';
                return partner.save();
              }).then(function () {
                return res.json(200, {
                  message: "You have selected " + partner.username + " as a partner, waiting for his/her confirmation."
                });
              });
          });

      }).catch(CustomError, function (e) {
        console.log(e);
        return res.json(404, {
          error: e.message
        });
      }).catch(function (e) {
        console.log(e);
        return res.send(500);
      });
  }
};
>>>>>>> origin/master