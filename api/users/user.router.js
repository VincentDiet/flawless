import express from "express";
import { get, getAll } from "./user.controller";

const userRouter = express.Router();

userRouter.get("/", getAll);
userRouter.get("/:id", get);

export default userRouter;
