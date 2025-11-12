const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// clean-community-db
// M6Pc77y0kXprykCx

const uri =
  "mongodb+srv://clean-community-db:M6Pc77y0kXprykCx@cluster0.xtjchvv.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const db = client.db("clean_community_db");
    const issuesCollection = db.collection("issues");
    const usersCollection = db.collection("users");
    const contributionCollection = db.collection("contribution");


    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
          res.send({ message: 'user already exits. do not need to insert again' })
      }
      else {
          const result = await usersCollection.insertOne(newUser);
          res.send(result);
      }
  })




    app.get('/latest-issues', async (req, res) => {
      const cursor = issuesCollection.find().sort({ created_at: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
  })

  //=================== Get All Issues =============================
    app.get("/issues", async(req, res) =>{
        const result = await issuesCollection.find().toArray();
        res.send(result)
    })

     //=================== Get Issues Details=============================
    app.get("/issues-details/:id", async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await issuesCollection.findOne(query);
      res.send(result);
    })


    //=================== Post Issues =============================
    app.post("/issues",   async (req, res) => {
      const data = req.body;
      // console.log(data)
      const result = await issuesCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });





    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World CleanCommunity!");
});

app.listen(port, () => {
  console.log(`CleanCommunity app listening on port ${port}`);
});
