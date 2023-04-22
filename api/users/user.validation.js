import { fieldsParamBuilder, searchParamBuilder, paginationParamsBuilder, populateParamBuilder } from "../../helpers/queryParamsBuilders";
import { body, query, param, check, validationResult } from "express-validator";

import lodash from "lodash";
const _ = lodash;

export const getAllValidation = [
  query("search").optional(),
  query("limit").optional().isInt(),
  query("page").optional().isInt(),
  query("sortBy").optional(),
  query("sortSens").optional(),

  query("name").optional(),
  query("discord_id").optional().isInt(),
  query("urt_auth").optional(),
  query("country").optional(),

  query("include_teams").optional().isBoolean(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const getValidation = [
  param("id").notEmpty().isMongoId(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
