exports.get404 = (req, res, next) => {
  // layout is special key for handlebars and it will not use defaultLayout if it is false
  res.status(404).render("404", { pageTitle: "Page Not Found" });
};
