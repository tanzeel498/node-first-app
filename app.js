require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
  cb(null, false);
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my first secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(flash());

app.use((req, res, next) => {
  User.findById(req.session?.user?._id)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch((err) => next(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(
  "/admin",
  multer({ storage: fileStorage, fileFilter }).single("image"),
  adminRoutes
);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/500", errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("mongoose connected");
    app.listen(4000);
  })
  .catch((err) => console.log(err));
