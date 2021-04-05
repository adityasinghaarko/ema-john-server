const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qk4l2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(cors())




client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
        res.send(result.insertedCount)
        console.log(result.insertedCount);
    })

  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((error, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((error, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray((error, documents) => {
      res.send(documents)
    })
  })

  app.post("/addOrder", (request, res) => {
    const order = request.body;
    console.log(order);
    // // ordersCollection.insertOne({orderInfo})
    // .then(result => {
    //     res.send(result.insertedCount > 0)
    //     console.log(result.insertedCount > 0);
    // })

  })

});


app.listen(port)