const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my first secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  User.findById("6582be5004049c729a61e1f1")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://tanzeel498:BOTFijyz20Cq7LlV@cluster0.vln0kdt.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("mongoose connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
