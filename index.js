const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.idotoa5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db('BrandShopDB').collection('brands');
    const productsCollection = client.db('BrandShopDB').collection('products');
    const cartCollection = client.db('BrandShopDB').collection('cart');
    
    // Fetching brands data
    app.get('/brands', async(req, res)=>{
      const cursor = brandCollection.find();
      const result =await cursor.toArray();
      res.send(result);
    })

    // Fetching Products Data from database

    app.get('/products', async(req, res)=>{
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/products/:brand', async(req, res)=>{
      const brand = req.params.brand;
      const cursor = productsCollection.find({BrandName :`${brand}`});
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.send(result);
    })

    // fetching Cart Data

    app.get('/cart', async(req, res)=>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Posting cart data to database
    app.post('/cart', async(req, res)=>{
      const newProduct  = req.body;
      const result = await cartCollection.insertOne(newProduct);
      res.send(result);
    })


    // data Post here

    app.post('/products', async(req, res)=>{
      const newProduct  = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    })

    // data Update

    app.put('/products/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedProduct = req.body;
      const Product ={
        $set:{
          name: updatedProduct.name,
          BrandName: updatedProduct.BrandName,
          ProductType: updatedProduct.ProductType,
          Price: updatedProduct.Price,
          Rating: updatedProduct.Rating,
          Description: updatedProduct.Description,
          Image: updatedProduct.Image,
        }
      }

      const result = await productsCollection.updateOne(filter, Product, options);
      res.send(result);

    })
    
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Brand Shop is running');
});

app.listen(port, () => {
  console.log('Brand Shop in running at port: ', port);
});
