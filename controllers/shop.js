const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const stripe = require("stripe")(
  "sk_test_51OkjI5KmzrzovZnjm6zX9Yy7qf1zMzoeN0wa1oRRy7MATWwoM764yU3iWtPNEcWJBF1jeRU5NYOd9nM8q9mbDsJG00ff8eLPDg"
);

const Product = require("../models/product");
const Order = require("../models/order");
const { ITEMS_PER_PAGE } = require("../util/constants");

exports.getProducts = async (req, res, next) => {
  const pageNumber = +req.query.page || 1;

  const numItems = await Product.find().countDocuments();

  Product.find()
    .skip((pageNumber - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        hasNextPage: pageNumber * ITEMS_PER_PAGE < numItems,
        hasPrevPage: pageNumber > 1,
        currentPage: pageNumber,
        lastPage: Math.ceil(numItems / ITEMS_PER_PAGE),
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

exports.getIndex = async (req, res, next) => {
  const pageNumber = +req.query.page || 1;

  const numItems = await Product.find().countDocuments();

  Product.find()
    .skip((pageNumber - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        hasNextPage: pageNumber * ITEMS_PER_PAGE < numItems,
        hasPrevPage: pageNumber > 1,
        currentPage: pageNumber,
        lastPage: Math.ceil(numItems / ITEMS_PER_PAGE),
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

exports.postCheckout = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items;
    let totalPrice = 0;
    products.forEach((item) => {
      totalPrice += item.productId.price * item.quantity;
    });

    const session = await stripe.checkout.sessions.create({
      line_items: products.map((p) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: p.productId.title,
              description: p.productId.description,
            },
            unit_amount: p.productId.price * 100,
          },
          quantity: p.quantity,
        };
      }),
      mode: "payment",
      payment_method_types: ["card"],
      success_url: req.protocol + "://" + req.get("host") + "/checkout/success",
      cancel_url: req.protocol + "://" + req.get("host") + "/cart",
    });

    console.log(session);

    res.status(303).redirect(session.url);
  } catch (err) {
    next(err);
  }
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
