const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const db = require("./util/database");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

// CODE STARTS HERE
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views"); // do not need to do this as this is the default. will need to do so if foldername is changed.

db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(result[0]);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
