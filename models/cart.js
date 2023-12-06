const fs = require("node:fs");
const path = require("node:path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

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
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
};
