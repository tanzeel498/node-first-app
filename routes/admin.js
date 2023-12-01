const express = require("express");

const router = express.Router();

// reachable through /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  console.log("In product middleware!");
  res.send(
    "<form method='POST' action='/admin/add-product'><input type='text' name='title' /><button type='submit'>Add Product</button></form>"
  );
});
// reachable through /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
