const fs = require("node:fs");
const path = require("node:path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

function writeToFile(data) {
  fs.writeFile(p, data, (err) => {
    console.log(err);
  });
}

module.exports = class Cart {
  constructor() {
    this.cart = [];
    this.totalPrice = 0;
  }

  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart i.e find product with id
      const existingProduct = cart.products.find((prod) => prod.id === id);

      // add product to the cart or increase quantity
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ id, quantity: 1 });
      }

      // updating the total Price of cart
      cart.totalPrice += productPrice;

      // write the cart back to file
      writeToFile(JSON.stringify(cart));
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;

      const cart = JSON.parse(fileContent);
      const product = cart.products.find((product) => product.id === id);
      if (!product) return;
      cart.totalPrice -= product.quantity * productPrice;
      cart.products = cart.products.filter((product) => product.id !== id);

      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) cb(null);
      else cb(JSON.parse(fileContent));
    });
  }
};
