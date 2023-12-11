const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const CartItem = sequelize.define("cartItem", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  quantity: DataTypes.INTEGER,
});

module.exports = CartItem;
