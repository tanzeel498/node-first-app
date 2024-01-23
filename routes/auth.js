const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password", "password needs to be valid").isLength({ min: 5 }),
  authController.postLogin
);
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .normalizeEmail()
      .custom((value) => {
        // if (value === "test@test.com") throw new Error("Email Forbidden");
        // return true;
        return User.findOne({ email: value }).then((user) => {
          if (user) return Promise.reject("Email already exists!");
        });
      }),
    body(
      "password",
      "Enter a password 5 characters long and containing numbers and text only"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Password doesn't match");
      return true;
    }),
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getUpdatePassword);
router.post("/update-password", authController.postUpdatePassword);

module.exports = router;
