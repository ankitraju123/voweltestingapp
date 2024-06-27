const request = require('request');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());

let apikey = '79deafc4cfa2cc026f17254358e44eac';
let pass = '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';
let shop = 'testingapp-vowel-web.myshopify.com';

app.get('/getdata', (req, res) => {
  let endpoint = 'products';
  let options = {
    method: "GET",
    url: `https://${apikey}:${pass}@${shop}/admin/api/2023-10/${endpoint}.json`,
    headers: {
      'Content-type': 'application/json'
    }
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.json(JSON.parse(response.body));
  });
});

app.post('/addproduct', (req, res) => {
    let endpoint = 'products';
    let options = {
      method: "POST",
      url: `https://${apikey}:${pass}@${shop}/admin/api/2023-10/${endpoint}.json`,
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        product: {
          title: req.body.title,
          body_html: req.body.description,
          vendor: req.body.vendor,
          images: [{ src: req.body.image }],
          variants: [{ price: req.body.price }]
        }
      })
    };
  
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.json(JSON.parse(response.body));
    });
  });
  
  // PUT to update an existing product
  app.put('/edit/:id', (req, res) => {
    let endpoint = `products/${req.params.id}`;
    let options = {
      method: "PUT",
      url: `https://${apikey}:${pass}@${shop}/admin/api/2023-10/${endpoint}.json`,
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        product: {
          id: req.params.id,
          title: req.body.title,
          body_html: req.body.description,
          vendor: req.body.vendor,
          images: [{ src: req.body.image }],
          variants: [{ price: req.body.price }]
        }
      })
    };
  
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.json(JSON.parse(response.body));
    });
  });
  
  // DELETE to remove an existing product
  app.delete('/delete/:id', (req, res) => {
    let endpoint = `products/${req.params.id}`;
    let options = {
      method: "DELETE",
      url: `https://${apikey}:${pass}@${shop}/admin/api/2023-10/${endpoint}.json`,
      headers: {
        'Content-type': 'application/json'
      }
    };
  
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.json(JSON.parse(response.body));
    });
  });
  

app.listen(8002, () => console.log('server running'));
