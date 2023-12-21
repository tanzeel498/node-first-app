const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  const existingProduct = this.cart.items?.find(
    (cartItem) => cartItem.productId.toString() === productId
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    this.cart.items.push({ productId, quantity: 1 });
  }
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  this.cart.items = this.cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", userSchema);

//   getOrders() {
//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }
