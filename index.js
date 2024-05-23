const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 5000


// Parser
app.use(express.json())
app.use(cors())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mi4xixr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const jobsCollection = client.db('jobNest').collection('allJobs')
    const postJobsCollection = client.db('jobNest').collection('postedJobs')



    // -----------------jobs related api---------------


    // Get all jobs
    app.get('/api/v1/jobs',async(req,res)=>{
        const result= await jobsCollection.find().toArray()
        res.send(result)
    })
    
    // POst a job
    app.post('/api/v1/jobs',async(req,res)=>{
        const data = req.body
        const result = await jobsCollection.insertOne(data)
        res.send(result)
    })


    // Get a single job
    app.get('/api/v1/jobs/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result= await jobsCollection.findOne(query)
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`jobNest app listening on port ${port}`)
})