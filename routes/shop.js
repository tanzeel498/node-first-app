const express = require("express");
const router = express.Router();
const path = require("path");

const rootPath = require("../util/rootPath");
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", { products, pageTitle: "Shop" });
});

module.exports = router;
