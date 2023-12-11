const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  req.user
    .createProduct({ title, imageUrl, price, description })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");

  const productId = req.params.productId;
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      if (!products.length) return res.redirect("/");
      res.render("admin/edit-product", {
        product: products.at(0),
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.destroy({ where: { id: productId } })
    .then(() => {
      console.log("PRODUCT DELETED!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
