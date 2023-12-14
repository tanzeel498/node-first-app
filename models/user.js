const { ObjectId } = require("mongodb");

const db = require("../util/database");

class User {
  constructor(_id, name, email, cart) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.cart = cart?.items?.length ? cart : { items: [] };
  }

  save() {
    return db.collection("users").insertOne(this);
  }

  getCart() {
    const productIds = this.cart.items.map((product) => product.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (i) => i.productId.toString() === product._id.toString()
            ).quantity,
          };
        });
      });
  }

  addToCart(prodId) {
    // prodId will be string i.e received through req.body
    const productId = new ObjectId(prodId);
    const existingProduct = this.cart.items?.find(
      (cartItem) => cartItem.productId.toString() === prodId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.items.push({ productId, quantity: 1 });
    }
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
  }

  deleteItemFromCart(productId) {
    this.cart.items = this.cart.items.filter(
      (i) => i.productId.toString() !== productId
    );
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
  }

  addOrder() {
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart.items = [];
        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
      })
      .catch((err) => console.log(err));
  }

  getOrders() {
    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }

  static findById(userId) {
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
