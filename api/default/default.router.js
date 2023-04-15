import express from "express";
import defaultController from "./default.controller";

const defaultRouter = express.Router();

defaultRouter.get("/", defaultController.findAll);

module.exports = defaultRouter;
