require("module-alias/register");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const compSetRoutes = require("./routes/compRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { getDb } = require("@db");
let port = 1337;
const cors = require("cors");

async function run() {
  try {
    const db = await getDb();
    const app = express();

    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use(bodyParser.json({ limit: "50mb" }));

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    const allowedOrigins = [
      "http://localhost:1337",
      "http://localhost:3000",
      "https://maven-deploy.vercel.app",
    ];
    app.use(
      cors({
        origin: function (origin, callback) {
          // allow requests with no origin
          // (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
          if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
      })
    );

    // Register Routes
    app.use("/comp-sets", compSetRoutes);
    app.use("/admin", adminRoutes);

    // Instantiate the express server
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();
