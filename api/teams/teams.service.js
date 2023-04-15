import teamsModel from "./teams.model";
import service from "../service";

module.exports.teamsService = class extends service {
  static model = teamsModel;
};
