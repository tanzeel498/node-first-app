const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: { user: "tanzeel498@gmail.com", pass: process.env.BREVO_SMTP_KEY },
});

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: req.flash("error").at(0),
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: req.flash("error").at(0),
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Username does not exist!");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((hasMatched) => {
        if (!hasMatched) {
          req.flash("error", "Incorrect Password!");
          return res.redirect("/login");
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists!");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          transporter.sendMail(
            {
              from: "noreply@nodeShop.com",
              to: email,
              subject: "SignUp Successfull",
              text: "Hello new User!!!",
              html: "<h1>Your account was created successfully!</h1><p>You can enjoy a free stay with for the rest of your life</p>",
            },
            function (err, info) {
              if (err) console.log(err);
              console.log(info);
            }
          );
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
