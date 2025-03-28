const { MongoClient } = require("mongodb");

async function getDb() {
  try {
    const connectedClient = await getConnectedClient();
    const db = connectedClient.db("maven");
    return db;
  } catch (err) {
    console.error(err);
  }
}
exports.getDb = getDb;

async function getConnectedClient() {
  try {
    const MONGO_URI = "mongodb://127.0.0.1:27017";

    const client = new MongoClient(MONGO_URI);
    const connectedClient = await client.connect();
    return connectedClient;
  } catch (err) {
    console.error(err);
  }
}
exports.getConnectedClient = getConnectedClient;
