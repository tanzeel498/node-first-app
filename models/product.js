const { ObjectId } = require("mongodb");

const db = require("../util/database");

class Product {
  constructor(_id, title, price, description, imageUrl, userId) {
    this._id = _id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  save() {
    if (this._id) {
      const { _id, ...remaingData } = this;
      return db
        .collection("products")
        .replaceOne({ _id: new ObjectId(_id) }, remaingData);
    } else {
      return db.collection("products").insertOne(this);
    }
  }

  static fetchAll() {
    return db.collection("products").find().toArray();
  }

  static findById(productId) {
    return db.collection("products").findOne({ _id: new ObjectId(productId) });
  }

  static deleteById(productId) {
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });
  }
}

module.exports = Product;
