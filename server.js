const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost/swag-shop');

const Product = require('./model/product');
const WishLists = require('./model/wishlist')

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function(req, res) {
  const product = new Product();
  product.title = req.body.title;
  product.price = req.body.price;
  product.save(function(err, savedProduct){
    if (err) {
      response.status(500).send({error:"Could not save product"});
    } else {
      response.send(savedProduct);
    }
  });
});

app.listen(3000, function() {
  console.log("Swap Shop API running on port 3000...");
});
