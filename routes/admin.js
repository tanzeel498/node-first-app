const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

// reachable through /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProducts);

// reachable through /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

module.exports = router;
