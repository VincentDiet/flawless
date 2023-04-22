import express from "express";

import {} from "./user.controller";

import { GET_ALL_CONFIG, GET_CONFIG } from "./user.config";
import User from "./user.model";

const userRouter = express.Router();

//userRouter.get("/", _getAll(User, GET_ALL_CONFIG));
//userRouter.get("/:id", get(User, GET_CONFIG));

export default userRouter;
