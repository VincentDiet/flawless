import express from "express";
import { get, getAll } from "./team.controller";

const teamRouter = express.Router();

teamRouter.get("/", getAll);
teamRouter.get("/:id", get);

export default teamRouter;
