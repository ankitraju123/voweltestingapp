const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  vendor: {
    type: String,
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
