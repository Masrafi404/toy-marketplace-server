const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.icictvn.mongodb.net/?retryWrites=true&w=majority`;

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

        const tabsProductCollection = client.db('tabsDB').collection('tabsProducts')

        const ProductCollection = client.db('ToyDB').collection('addToys')

        app.get('/tabs', async (req, res) => {
            const result = await tabsProductCollection.find().toArray();
            res.send(result)
        })

        // add toy
        app.post('/addToy', async (req, res) => {
            const toy = req.body;
            const result = await ProductCollection.insertOne(toy)
            console.log(toy)
            res.send(result)
        })

        app.get('/allToy', async (req, res) => {
            const cursor = ProductCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // specific email get data

        app.get('/currentUD', async (req, res) => {
            let query = {}
            if (req.query?.sellerEmail) {
                query = { sellerEmail: req.query.sellerEmail }
            }
            const result = await ProductCollection.find(query).toArray()
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
    res.send('Toy server is running')
})

app.listen(port, () => {
    console.log(`toy server running on port ${port}`)
})