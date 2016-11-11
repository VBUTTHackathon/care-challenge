/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  fetchDuos:function(req, res) {
    Duo.create({ picker: 1, picked: 1})
    Duo.find().exec(function(err, duos) {
      //@TODO handle errors
      return res.json(duos);
    })
  }
};

