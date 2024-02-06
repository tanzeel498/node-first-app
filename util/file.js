const fs = require("fs");

exports.deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw new Error("Error deleting file");
  });
};
