const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("Product", productSchema);

// const mongodb = require("mongodb");
// const db = require("../util/database");

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     let dbOp;
//     if (this._id) {
//       // Update the product
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp;
//   }

//   static fetchAll() {
//     return db.collection("products").find().toArray();
//   }

//   static findById(prodId) {
//     return db
//       .collection("products")
//       .findOne({ _id: new mongodb.ObjectId(prodId) });
//   }

//   static deleteById(prodId) {
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) });
//   }
// }

// module.exports = Product;
