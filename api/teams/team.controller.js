import {} from "./team.service";
import { index, show } from "../../utils/services/services";
import Team from "./team.model";
import { searchMaker } from "../helpers";

import lodash from "lodash";
const _ = lodash;

export const getAll = async (req, res) => {
  try {
    const fields = ["name", "tag", "captain", "ftw_id", "is_national_team", "discord_link", "createdAt", "updatedAt"];
    const options = _.pick(req.query, ["limit", "page", "sortBy", "sortSens", "include_members", "include_discord"]);
    const search = searchMaker(req.query.search, ["name", "tag"]);
    const filters = _.pick(req.query, ["name", "tag", "is_national_team", "country"]);
    const populate = [];

    if (options.include_members == "true") {
      fields.push("members");
      populate.push({ id: "members.user", fields: ["pseudo", "urt_auth", "country"] });
    }
    if (options.include_discord == "true") {
      fields.push("discord");
    }

    const datas = await index(Team, fields, populate, options, filters, search);

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
    const fields = ["name", "tag", "country", "captain", "members", "ftw_id", "discord_link", "is_national_team", "createdAt", "updatedAt"];
    const options = _.pick(req.query, ["include_discord"]);
    const populate = [{ id: "members.user", fields: ["pseudo", "urt_auth", "country"] }];
    if (options.include_discord == "true") {
      fields.push("discord");
    }

    const team = await show(Team, id, fields, populate, options);

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
