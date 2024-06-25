const Router = require('koa-router');
const Product = require('../models/product');

const router = new Router();

router.get('/products', async (ctx) => {
  try {
    const products = await Product.find({});
    ctx.body = products;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

router.post('/product', async (ctx) => {
  try {
    const newProduct = new Product(ctx.request.body);
    const savedProduct = await newProduct.save();
    ctx.body = savedProduct;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

router.delete('/product/:id', async (ctx) => {
  try {
    const product = await Product.findByIdAndDelete(ctx.params.id);
    ctx.body = product;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

module.exports = router;
