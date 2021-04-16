const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

//TODO: remove body-parser module

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://temp:" + process.env.MONGO_PASSWORD + "@cluster0.qpoyp.mongodb.net/esa", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


var product;
var cart;

const productSchema = {
  productId: String,
  category: String,
  ModileproductName: String,
  productModel: String,
  price: Number,
  availableQuantity: Number
}

const cartSchema = {
  userId: String,
  item: Array
}


const Product = mongoose.model("Product", productSchema);
const Cart = mongoose.model("Cart", cartSchema);


Product.find({}, function (err, result) {
  product = result;
});




app.get("/rest/v1/products/", (req, res) => {
  res.send(product)
});


app.put("/rest/v1/users/:uuid/cart", async (req, res) => {
  const userId = req.params.uuid
  const productId = req.body.productId
  const quantity = req.body.quantity
  var items = [];
  let amount;
  var productNotFound = false;


  try {
    await Product.findOne({
      productId: productId
    }, async function (err, result) {
      try {
        if (quantity > result.availableQuantity) {
          res.send("Quantity greater than available")
        } else {
          await Product.updateOne({
            productId: productId
          }, {
            availableQuantity: result.availableQuantity - quantity
          }).exec()
          amount = result.price * quantity
        }
      } catch (error) {
        productNotFound = true
        res.status(500).send("Server Error");
      }
    }).exec();

    const temp = {
      productId: productId,
      quantity: quantity,
      amount: amount
    }

    items.push(temp)

    await Cart.findOne({
      userId: userId
    }, (err, result) => {
      if (result != null) {
        result.item.forEach(item => {
          items.push(item)
        });
      }
    })

    const result = await Cart.updateOne({
      userId: userId
    }, {
      item: items
    });
    if (!productNotFound && result.n == 0) {
      const newCart = new Cart({
        userId: userId,
        item: items
      })
      newCart.save()
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});



app.get("/rest/v1/users/:uuid/cart", (req, res) => {
  const userId = req.params.uuid
  Cart.find({
    userId: userId
  }, function (err, result) {
    cart = result;
  });
  res.send(cart)
});





app.listen(process.env.PORT || 3030, function () {
  console.log("Server started on port 3030");
});