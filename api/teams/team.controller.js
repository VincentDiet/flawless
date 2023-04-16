import Team from "./team.model";

import { index, show } from "../../utils/services/services";
import {} from "./team.service";

import { buildQueryParams } from "../../helpers/helpers";

import lodash from "lodash";
const _ = lodash;

export const getAll = async (req, res) => {
  try {
    const queryParams = buildQueryParams(req.query, {
      fields: ["name", "tag", "captain", "ftw_id", "is_national_team", "discord_link", "createdAt", "updatedAt"],
      optionalFields: ["members", "discord"],
      allowedFilters: ["name", "tag", "is_national_team", "country"],
      searchFields: ["name", "tag"],
      populateFields: [{ fields: "members", populateOn: "members.user", isOptional: true }],
      defaultSort: { sortBy: "name", sortSens: "asc" },
    });

    const datas = await index(Team, queryParams);

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
    const fields = ["name", "tag", "country", "captain", "members", "ftw_id", "discord_link", "is_national_team", "createdAt", "updatedAt"];
    const options = _.pick(req.query, ["include_discord"]);
    const populate = [{ id: "members.user", fields: ["pseudo", "urt_auth", "country"] }];
    if (options.include_discord == "true") {
      fields.push("discord");
    }

    const team = await show(Team, req.params.id, params);

    if (team == null) {
      res.status(404).json({
        result: "error",
        message: "This team does not exist.",
      });
      return;
    }

    res.status(200).json({
      result: "success",
      datas: team,
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      message: error.message,
    });
  }
};
