/**
 * DuoController
 *
 * @description :: Server-side logic for managing Duos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
  duos: function (req, res) {
    return Duo.find().populate('picker').populate('picked')
      .then(function (duos) {
        res.json({
          data: duos.map(function (duo) {
            var name1 = duo.picker.firstName + " " + (duo.picker.lastName || "");
            var name2 = duo.picked.firstName + " " + (duo.picked.lastName || "");
            return { partnerId1: duo.picker.id,
                     partnerId2: duo.picked.id,
                     partnerName1: name1,
                     partnerName2: name2 };
          })
        });
      });
  },

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
            return Duo.findOne(duoId).populate('picked');
          });
      }).then(function (duo) {
        var duoId = duo.id;
        var picked = duo.picked;
        picked.state = "none";
        picked.duo = null;
        return picked.save()
          .then(function () {
            return  Duo.destroy(duoId);
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
              .then(function (duo) {
                currUser.duo = duo.id;
                currUser.state = 'chose';
                return currUser.save()
                  .then(function () {
                    partner.duo = duo.id;
                    partner.state = 'chosen';
                    return partner.save();
                  });
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
