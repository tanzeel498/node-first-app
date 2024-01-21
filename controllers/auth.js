const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("node:crypto");

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
    errorMessage: req.flash("error").at(0),
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: req.flash("error").at(0),
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Incorrect Email or Password!");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((hasMatched) => {
        if (!hasMatched) {
          req.flash("error", "Incorrect Email or Password!");
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
          res.redirect("/login");
          return transporter.sendMail(
            {
              from: "noreply@nodeShop.com",
              to: email,
              subject: "SignUp Successfull",
              html: "<h1>Your account was created successfully!</h1><p>You can enjoy a free stay with for the rest of your life</p>",
            },
            function (err, info) {
              if (err) console.log(err);
              console.log(info.messageId);
            }
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error").at(0),
  });
};

exports.postReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Email does not exist!");
      return res.redirect("/reset");
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.passwordReset = { token, expire: Date.now() + 30 * 60 * 1000 };
    user.save().then((user) => {
      res.redirect("/login");
      return transporter.sendMail({
        from: "noreply@nodeShop.com",
        to: email,
        subject: "Password Reset",
        html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:4000/reset/${token}">link</a> to set a new password.</p>
        `,
      });
    });
  } catch (err) {
    console.error(err);
  }
};

exports.getUpdatePassword = async (req, res, next) => {
  const { token } = req.params;
  const user = await User.findOne({
    "passwordReset.token": token,
    "passwordReset.expire": { $gt: Date.now() },
  });

  if (!user) return res.redirect("/");
  res.render("auth/update-password", {
    path: "/update-password",
    pageTitle: "Update Password",
    errorMessage: req.flash("error").at(0),
    token,
  });
};

exports.postUpdatePassword = async (req, res) => {
  const { password, token } = req.body;
  const user = await User.findOne({
    "passwordReset.token": token,
    "passwordReset.expire": { $gt: Date.now() },
  });
  if (!user) return res.redirect("/");

  user.password = await bcrypt.hash(password, 12);
  user.passwordReset = undefined;
  await user.save();
  res.redirect("/login");
};
