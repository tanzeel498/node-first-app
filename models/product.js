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
  constructor(title) {
    this.title = title;
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
