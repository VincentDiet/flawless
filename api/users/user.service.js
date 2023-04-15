import usersModel from "./user.model";
import service from "../service";

module.exports.usersService = class extends service {
  static model = usersModel;
};
