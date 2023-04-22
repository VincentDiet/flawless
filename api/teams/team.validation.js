import { body, query, param, check, validationResult } from "express-validator";
import Team from "./team.model";

import lodash from "lodash";
const _ = lodash;

export const getAllValidation = [
  query("search").optional(),
  query("limit").optional().isInt(),
  query("page").optional().isInt(),
  query("sortBy").optional(),
  query("sortSens").optional(),

  query("name").optional(),
  query("tag").optional(),
  query("country").optional(),
  query("is_national_team").optional().isBoolean(),

  query("include_members").optional().isBoolean(),
  query("include_discord").optional().isBoolean(),

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
  query("include_discord").optional().isBoolean(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const storeValidation = [
  body("name")
    .notEmpty()
    .withMessage("Cannot be null.")
    .bail()
    .custom(async (name) => {
      const team = await Team.findOne({ name });
      if (team) {
        throw new Error("This name is in use.");
      }
    }),
  body("tag")
    .notEmpty()
    .withMessage("Cannot be null.")
    .bail()
    .custom(async (tag) => {
      const team = await Team.findOne({ tag });
      if (team) {
        throw new Error("This tag is in use.");
      }
    }),
  body("country").notEmpty().withMessage("Cannot be null."),
  body("captain").notEmpty().withMessage("Cannot be null.").bail().isMongoId().withMessage("Must be a valid ID"),
  body("roster_message_id").optional().isInt().withMessage("Must be an INT"),
  body("role_id").optional().isInt().withMessage("Must be an INT"),
  body("discord_link").optional(),
  body("ftw_id").optional().isInt().withMessage("Must be an INT"),
  body("is_national_team").optional().isBoolean().withMessage("Must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, tag, country, captain, roster_message_id, role_id, discord_link, ftw_id, is_national_team } = req.body;
    next.data = {
      name,
      tag,
      country,
      captain,
      discord: {
        roster_message_id,
        role_id,
      },
      discord_link,
      ftw_id,
      is_national_team,
    };
    next();
  },
];

export const updateValidation = [
  body("name")
    .optional()
    .custom(async (name) => {
      const team = await Team.findOne({ name });
      if (team) {
        throw new Error("This name is in use.");
      }
    }),
  body("tag")
    .optional()
    .custom(async (tag) => {
      const team = await Team.findOne({ tag });
      if (team) {
        throw new Error("This tag is in use.");
      }
    }),
  body("country").optional(),
  body("captain").optional(),
  body("roster_message_id").optional(),
  body("role_id").optional(),
  body("discord_link").optional(),
  body("ftw_id").optional(),
  body("is_national_team").optional(),
  body("members").isEmpty(),
  body("discord").isEmpty(),

  param("id")
    .isMongoId()
    .withMessage("Must be a valid ID")
    .bail()
    .custom(async (id) => {
      const team = await Team.findById(id);
      if (!team) {
        throw new Error("This team doesn't exist.");
      }
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].path));
    }
    next();
  },
];
