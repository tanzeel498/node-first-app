const db = require("../util/database");

const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id; // this will be received only for editing products
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)",
      [this.title, this.imageUrl, this.description, this.price]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findbyId(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }

  static deleteById(id) {}
};
