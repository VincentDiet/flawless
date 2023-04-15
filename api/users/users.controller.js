import { usersService } from "./users.service";
import lodash from "lodash";
import { searchMaker } from "../helpers";

const _ = lodash;

const findAll = async (req, res) => {
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

    const datas = await usersService.index(fields, populate, options, filters, search);

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

const findOneById = async (req, res) => {
  try {
    const id = req.params.id;
    const fields = ["discord_id", "urt_auth", "name", "country", "createdAt", "updatedAt", "teams"];
    const options = _.pick(req.query, []);
    const populate = [{ id: "teams.team", fields: ["name", "tag", "country", "is_national_team"] }];

    const user = await usersService.show(id, fields, populate, options);

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

module.exports = { findAll, findOneById };
