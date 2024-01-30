const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");

router.get("/products", isAuth, adminController.getProducts);
router.get("/add-product", isAuth, adminController.getAddProduct);
router.post(
  "/add-product",
  [
    body("title").isString().trim().rtrim().isLength({ min: 3 }),
    body("price").isFloat(),
    body("description").trim().rtrim().isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  adminController.postAddProduct
);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post(
  "/edit-product",
  [
    body("title").isString().trim().rtrim().isLength({ min: 3 }),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").trim().rtrim().isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  adminController.postEditProduct
);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
