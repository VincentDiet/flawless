import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import router from "./api/router";

// DB connection
connectDB();

const app = express();

// Security ??
const apiKey = "123";
const checkApiKey = (req, res, next) => {
  if (!req.headers.key || req.headers.key !== apiKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Router
// app.use("/", checkApiKey, router);
app.use("/", router);

// Start server
app.listen(process.env.SERVER_PORT, () => console.log("Server Running http://localhost:" + process.env.SERVER_PORT + ")"));
