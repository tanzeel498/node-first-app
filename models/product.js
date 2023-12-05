const fs = require("node:fs");
const path = require("node:path");

const rootPath = require("../util/rootPath");

const p = path.join(rootPath, "data", "products.json");

function fetchProducts(callback) {
  fs.readFile(p, (err, fileContent) => {
    if (err) callback([]);
    else callback(JSON.parse(fileContent));
  });
}

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    fetchProducts((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) throw new Error(err.message);
      });
    });
  }

  static fetchAll(callback) {
    fetchProducts(callback);
  }
};
