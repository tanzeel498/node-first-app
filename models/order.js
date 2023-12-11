const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
});

module.exports = Order;
