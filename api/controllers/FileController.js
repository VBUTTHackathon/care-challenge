/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  upload: function  (req, res) {
    req.file('csv').upload({ maxBytes: 1000000 }, // Max file size ~ 1Mb
      function (err, files) {
        if (err)
          return res.serverError(err);

        return res.json({
          message: files.length + ' file(s) uploaded successfully!',
          files: files
        });
    });
  }
};

