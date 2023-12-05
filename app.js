const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// CODE STARTS HERE
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views"); // do not need to do this as this is the default. will need to do so if foldername is changed.

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // layout is special key for handlebars and it will not use defaultLayout if it is false
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000);
