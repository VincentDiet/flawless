import express from "express";
import usersRouter from "./users/users.router";
import teamsRouter from "./teams/teams.router";
//import { migration } from "../migrations/migrations";

const router = express.Router();

// router.get("/migrate", migration);
// router.use("/competitions", require("./competitions.router"));
// router.use("/teams", require("./teams.router"));
router.use("/users", usersRouter);
router.use("/teams", teamsRouter);

module.exports = { router };
