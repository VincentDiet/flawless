import express from "express";
import userRouter from "./users/user.router";
import teamRouter from "./teams/team.router";
//import { migration } from "../migrations/migrations";

const router = express.Router();

// router.get("/migrate", migration);
// router.use("/competitions", require("./competitions.router"));
// router.use("/teams", require("./teams.router"));
router.use("/users", userRouter);
router.use("/teams", teamRouter);

export default router;
