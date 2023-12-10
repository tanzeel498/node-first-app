const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "hjI$5_()_pak%123", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
