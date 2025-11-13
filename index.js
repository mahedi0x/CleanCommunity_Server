const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());


const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtjchvv.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,

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

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        res.send({
          message: "user already exits. do not need to insert again",
        });
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/latest-issues", async (req, res) => {
      const cursor = issuesCollection.find().sort({ created_at: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

  

    //=================== Get Issues Details=============================
    app.get("/issues-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await issuesCollection.findOne(query);
      res.send(result);
    });

    //=================== Post Issues =============================
    app.post("/issues", async (req, res) => {
      const data = req.body;
      // console.log(data)
      const result = await issuesCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    //=================== my-issues =============================
    app.get("/my-issues", async (req, res) => {
      const email = req.query.email;
      const result = await issuesCollection
        .find({ created_by: email })
        .toArray();
      res.send(result);
    });

    app.delete("/issues/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await issuesCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/issues/:id", async (req, res) => {
      const id = req.params.id;
      const updatedIssue = req.body;
      console.log(id, updatedIssue);
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          title: updatedIssue.title,
          category: updatedIssue.category,
          amount: updatedIssue.amount,
          status: updatedIssue.status,
        },
      };
      const result = await issuesCollection.updateOne(query, update);
      res.send(result);
    });

    app.get("/issues", async (req, res) => {
      const { category, status } = req.query;
      const query = {};

      if (category && category !== "all") {
        query.category = category;
      }
      if (status && status !== "all") {
        query.status = status;
      }

      const cursor = issuesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/contributions", async (req, res) => {
      const data = req.body;
      const result = await contributionCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    app.get("/contributions", async (req, res) => {
      const result = await contributionCollection.find().toArray();
      res.send(result);
    });

    app.get("/contributions/:id", async (req, res) => {
      const id = req.params.id;
      const query = { issueId: id };
      const result = await contributionCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/my-contribution", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const result = await contributionCollection.find(query).toArray();
      res.send(result);
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
