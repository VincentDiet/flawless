import express from "express";

import { getAll, get, store, destroy, update, addMember, removeMember, updateMember } from "./team.controller";
import { storeValidation, getAllValidation, getValidation, updateValidation } from "./team.validation";
import { handleError } from "vue";

const teamRouter = express.Router();

teamRouter.get("/", getAllValidation, getAll);
teamRouter.get("/:id", getValidation, get);
teamRouter.post("/", storeValidation, store);
teamRouter.delete("/:id", destroy);
teamRouter.patch("/:id", updateValidation, update);

teamRouter.patch("/:teamId/add-member/:userId", addMember);
teamRouter.patch("/:teamId/remove-member/:userId", removeMember);
teamRouter.patch("/:teamId/update-member/:userId", updateMember);

export default teamRouter;
