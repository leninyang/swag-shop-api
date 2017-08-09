const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost/swag-shop');

const Product = require('./model/product');
const WishList = require('./model/wishlist')

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// GET ROUTE - PRODUCTS
app.get('/product', function(req, res) {
  Product.find({}, function(err, products) {
    if (err) {
      res.status(500).send({error: "Could not fetch products"})
    } else {
      res.send(products);
    }
  });
});

// GET ROUTE - WISHLIST
app.get('/wishlist', function(req, res) {
          //Path I want to populate | product inside wishlist
  WishList.find({}).populate({path:'products', model: 'Product'}).exec(function(err, wishList) {
    if (err) {
      res.status(500).send({error:'Could not fetch wishlist'})
    } else {
      res.send(wishList);
    }
  });
});

// POST ROUTE - PRODUCTS
app.post('/product', function(req, res) {
  const product = new Product();
  product.title = req.body.title;
  product.price = req.body.price;
  product.save(function(err, savedProduct){
    if (err) {
      res.status(500).send({error:"Could not save product"});
    } else {
      res.send(savedProduct);
    }
  });
});

//POST ROUTE- WISHLIST
app.post('/wishlist', function(req, res) {
  const wishList = new WishList();
  wishList.title = req.body.title;
  wishList.save(function(err, newWishList) {
    if (err) {
      res.status(500).send({error: "Could not create wishlist"})
    } else {
      res.send(newWishList);
    }
  });
});

//PUT ROUTE - WISHLIST
app.put('/wishlist/product/add', function(req, res) {
  Product.findOne({_id: req.body.productId}, function(err, product) {
    if (err) {
      res.status(500).send({error: "Could not add item to wishlist"})
    } else {
      WishList.update({_id:req.body.wishListId}, {$addToSet:{products: product._id}}, function(err, wishList) {
        if (err) {
          res.status(500).send({error: "Could not add item to wishlist"})
        } else {
          res.send('Successfully added to wishlist');
        }
      });
    }
  });
});


app.listen(3000, function() {
  console.log("Swap Shop API running on port 3000...");
});
