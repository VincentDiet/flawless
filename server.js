import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import router from "./api/router";
import errorHandler from "./errors/errorHandler";

// DB connection
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.use(errorHandler);

// Start server
app.listen(process.env.SERVER_PORT, () => console.log("Server Running http://localhost:" + process.env.SERVER_PORT + ")"));
