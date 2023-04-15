import express from "express";
import usersController from "./users.controller";

const usersRouter = express.Router();

usersRouter.get("/", usersController.findAll);
usersRouter.get("/:id", usersController.findOneById);

module.exports = usersRouter;
