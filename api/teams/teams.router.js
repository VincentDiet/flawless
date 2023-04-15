import express from "express";
import teamsController from "./teams.controller";

const teamsRouter = express.Router();

teamsRouter.get("/", teamsController.findAll);
teamsRouter.get("/:id", teamsController.findOneById);

module.exports = teamsRouter;
