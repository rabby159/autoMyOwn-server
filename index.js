const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhl2xpe.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection = client.db("autoMyDB").collection("users");
    const shopCollection = client.db("autoMyDB").collection("shops");

    //user related api
    app.get('/users', async(req, res) =>{
        const result = await userCollection.find().toArray()
        res.send(result)
    })

    app.post('/users', async(req, res) => {
        const user = req.body;
        const query = {email: user.email}
        const existingUser = await userCollection.findOne(query);
        if(existingUser){
            return res.send({message: 'user already exists', insertedId: null})
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    //create shop relared api
    app.get('/shops', async(req, res) =>{
        const result = await shopCollection.find().toArray()
        res.send(result)
    });

    app.post('/shops', async(req, res) => {
        const list = req.body;
        const result = await shopCollection.insertOne(list)
        res.send(result)
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
    res.send('autoMyOwn website server is running...')
  })
  
  app.listen(port, () => {
    console.log(`autoMyOwn website server is running on port ${port}`);
  })