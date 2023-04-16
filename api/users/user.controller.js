import User from "./user.model";

import { index, show } from "../../utils/services/services";
import {} from "./user.service";

import { buildQueryParams } from "../../helpers/helpers";

import lodash from "lodash";
const _ = lodash;

export const getAll = async (req, res) => {
  try {
    const queryParams = buildQueryParams(req.query, {
      fields: ["discord_id", "urt_auth", "name", "country", "createdAt", "updatedAt"],
      optionalFields: ["teams"],
      allowedFilters: ["discord_id", "name", "urt_auth", "country"],
      searchFields: ["name", "urt_auth"],
      populateFields: [{ fields: "teams", populateOn: "teams.team", isOptional: true }],
      defaultSort: { sortBy: "name", sortSens: "asc" },
    });

    const datas = await index(User, queryParams);

    res.status(200).json(datas);
  } catch (error) {
    res.status(400).json({
      result: "error",
      message: error.message,
    });
  }
};

export const get = async (req, res) => {
  try {
    const id = req.params.id;
    const fields = ["discord_id", "urt_auth", "name", "country", "createdAt", "updatedAt", "teams"];
    const options = _.pick(req.query, []);
    const populate = [{ id: "teams.team", fields: ["name", "tag", "country", "is_national_team"] }];

    const user = await show(User, id, fields, populate, options);

    if (user == null) {
      res.status(404).json({
        result: "error",
        message: "This user does not exist.",
      });
      return;
    }

    res.status(200).json({
      result: "success",
      datas: user,
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      message: error.message,
    });
  }
};
