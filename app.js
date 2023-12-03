const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressHbs = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

const hbs = expressHbs.create({ defaultLayout: "main-layout" });

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // layout is special key for handlebars and it will not use defaultLayout if it is false
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000);
