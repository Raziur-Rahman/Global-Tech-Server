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
    // app.post('/brands', async(req, res)=>{
    //   const options = { ordered: true }
    //     const result = brandCollection.insertMany(docs, options);
    //     console.log(result)
    // })

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
