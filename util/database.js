const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://tanzeel498:BOTFijyz20Cq7LlV@cluster0.vln0kdt.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("shop");
module.exports = db;
