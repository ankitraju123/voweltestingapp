const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/vowel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch((err) => console.log(err));

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  price: { type: Number },
  vendor: { type: String },
});

const Product = mongoose.model('Product', productSchema);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/api/products', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

app.post('/api/product', async (req, res) => {
  const { title, image, description, price, vendor } = req.body;
  const product = new Product({ title, image, description, price, vendor });
  await product.save();
  res.status(201).json(product);
});

app.put('/api/product/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(product);
  });
  
app.delete('/api/product/:id', async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
