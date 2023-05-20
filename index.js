const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//-------------------------------------------------------------------------------------------


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.unedq5l.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect(); //


    const toyCollection = client.db('kidsToy').collection('toys');
    const addToysCollection = client.db('kidsToy').collection("addtoys");

    app.post("/addtoys", async(req, res) => {
      const booking = req.body
      const result = await addToysCollection.insertOne(booking)
      res.send(result)
    })

    app.get("/addtoys", async (req, res) => {
      const result = await addToysCollection.find().toArray()
      res.send(result)
    })

    app.get("/addtoys/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await addToysCollection.findOne(query)
      res.send(result)
    })

    app.get('/addtoys', async(req,res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await addToysCollection.find(query).toArray();
      res.send(result)
    })

    app.delete("/addtoys/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await addToysCollection.deleteOne(query)
      res.send(result)
    })


    app.get('/toys', async(req, res)=>{
        const result = await toyCollection.find().toArray();
        res.send(result);
    })

    app.get('/toys/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await toyCollection.findOne(query);
        res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 }); //
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//-------------------------------------------------------------------------------------------

app.get('/', (req, res)=>{
    res.send('Kids toy server is running')
});

app.listen(port, ()=>{
    console.log(`Kids toy server is running on port: ${port}`);
})