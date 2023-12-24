const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product({
    title: "Air Jordan 1 low OG Shoes",
    subtitle: "Shoes",
    description:
      '<div><h4>TIMELESS STYLE ICON.</h4><br/><p>The Air Jordan 1 Low OG remakes the classic sneaker with new colors and textures. Premium materials and accents give fresh expression to an all-time favorite.</p><br/><p><b>Benefits</b></p><ul className="list-disc pl-4"><li>Encapsulated Air unit provides lightweight cushioning.</li><li>Leather and textile materials in the upper are light and durable.</li></ul><br/><p><b class="headline-5">Product Details</b></p><ul className="list-disc pl-4"><li>Wings logo on heel</li><li>Perforated toe</li><li>Foam midsole</li><li>Rubber traction<li>Shown: White/White/University Red</li><li>Style: CZ0790-161</li></li></ul></div>',
    descriptionPreview:
      "The Air Jordan 1 Low OG remakes the classic sneaker with new colors and textures. Premium materials and accents give fresh expression to an all-time favorite.",
    gender: ["MEN", "WOMEN"],
    category: ["Lifestyle", "Sports", "Fashion"],
    styleCode: "CZ0790",
    colors: [
      {
        styleColor: "CZ0790-161",
        styleCode: "CZ0790",
        colorDescription: "White/White/University Red",
        fullPrice: 140,
        currentPrice: 120,
        portraitUrl:
          "https://static.nike.com/a/images/c_limit,w_400,f_auto/t_product_v1/765d7bf9-2619-4c80-b134-07f7a91c0a42/image.jpg",
        squarishUrl:
          "https://static.nike.com/a/images/t_default/dcd622c5-b526-4223-991a-ef9d5e9052af/gt-cut-2-team-mens-basketball-shoes-B1VfPf.png",
        images: [
          {
            src: "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/a5c9ae04354249b0a781fd4dfa61e7ca_9366/lite-racer-adapt-6.0-shoes.jpg",
            alt: "side view",
          },
          {
            src: "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/e6b2a6b5019046f9958b5327c99baa12_9366/lite-racer-adapt-6.0-shoes.jpg",
            alt: "top view",
          },
          {
            src: "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/62d3d9c639c44a0d8d27640a2ad3acf7_9366/lite-racer-adapt-6.0-shoes.jpg",
            alt: "front top view",
          },
        ],
        skus: [
          { size: 3.5, available: true },
          { size: 4, available: true },
          { size: 4.5, available: true },
          { size: 5, available: false },
          { size: 5.5, available: true },
          { size: 6, available: true },
          { size: 6.5, available: true },
          { size: 7.5, available: true },
          { size: 8, available: true },
          { size: 9, available: true },
          { size: 10, available: false },
        ],
      },
      {
        styleColor: "CZ0790-162",
        styleCode: "CZ0790",
        colorDescription: "White/Black/Maroon",
        fullPrice: 136,
        currentPrice: 115,
        portraitUrl:
          "https://static.nike.com/a/images/c_limit,w_400,f_auto/t_product_v1/765d7bf9-2619-4c80-b134-07f7a91c0a42/image.jpg",
        squarishUrl:
          "https://static.nike.com/a/images/t_default/dcd622c5-b526-4223-991a-ef9d5e9052af/gt-cut-2-team-mens-basketball-shoes-B1VfPf.png",
        images: [
          {
            src: "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/a5c9ae04354249b0a781fd4dfa61e7ca_9366/lite-racer-adapt-6.0-shoes.jpg",
            alt: "side view",
          },
          {
            src: "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/e6b2a6b5019046f9958b5327c99baa12_9366/lite-racer-adapt-6.0-shoes.jpg",
            alt: "top view",
          },
          {
            src: "https://assets.adidas.com/images/w_280,h_280,f_auto,q_auto:sensitive/62d3d9c639c44a0d8d27640a2ad3acf7_9366/lite-racer-adapt-6.0-shoes.jpg",
            alt: "front top view",
          },
        ],
        skus: [
          { size: 3.5, available: true },
          { size: 4, available: true },
          { size: 4.5, available: true },
          { size: 5, available: true },
          { size: 5.5, available: false },
          { size: 6, available: true },
          { size: 6.5, available: true },
          { size: 7.5, available: false },
          { size: 10, available: true },
        ],
      },
    ],
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
