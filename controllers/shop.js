const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((error) => next(error));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((error) => next(error));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => next(error));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((error) => next(error));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .addToCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((error) => next(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((error) => next(error));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((error) => next(error));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((error) => next(error));
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);

  Order.findById(orderId)
    .then((order) => {
      if (!order) return next(new Error("Order Not Found!"));
      if (order.user.userId.toString() !== req.user._id.toString())
        return next(new Error("Unauthorized Action!"));

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${invoiceName}`
      );
      doc.pipe(fs.createWriteStream(invoicePath));
      doc.pipe(res);

      doc.fontSize(30).text("Invoice", { align: "center", underline: true });
      doc.moveDown();
      let totalPrice = 0;
      order.products.forEach((item) => {
        totalPrice += item.quantity * item.product.price;
        doc.fontSize(14).text(item.product.title, {
          align: "left",
          continued: true,
        });
        doc.text(`${item.quantity} x $${item.product.price}`, {
          align: "center",
          continued: true,
        });
        doc.text("$" + (item.quantity * item.product.price).toFixed(2), {
          align: "right",
        });
        doc.moveDown();
      });

      doc.moveDown();
      doc.fontSize(20).text("Summary", { underline: true });
      doc.fontSize(16).text(`Total Price : $${totalPrice}`, { align: "right" });

      doc.end();
    })
    .catch((err) => next(err));
};
