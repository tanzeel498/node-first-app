const { ObjectId } = require("mongodb");

const db = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    return db.collection("products").insertOne(this);
  }

  static fetchAll() {
    return db.collection("products").find().toArray();
  }

  static findById(productId) {
    return db.collection("products").findOne({ _id: new ObjectId(productId) });
  }
}

module.exports = Product;
