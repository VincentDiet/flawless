import User from "./user.model";

import {} from "./user.service";
import { index, show } from "../../utils/services/services";

import { searchMaker } from "../helpers";

import lodash from "lodash";
const _ = lodash;

export const getAll = async (req, res) => {
  try {
    const fields = ["discord_id", "urt_auth", "name", "country", "createdAt", "updatedAt"];
    const options = _.pick(req.query, ["limit", "page", "sortBy", "sortSens", "include_teams"]);
    const search = searchMaker(req.query.search, ["name", "urt_auth"]);
    const filters = _.pick(req.query, ["discord_id", "name", "urt_auth", "country"]);
    const populate = [];
    if (options.include_teams == "true") {
      fields.push("teams");
      populate.push({ id: "teams.team", fields: ["name", "tag", "country", "is_national_team"] });
    }

    const datas = await index(User, fields, populate, options, filters, search);

    res.status(200).json({
      result: "success",
      datas: datas.datas,
      totalPage: datas.totalPage,
      currentPage: datas.currentPage,
    });
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
