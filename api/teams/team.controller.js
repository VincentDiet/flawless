import Team from "./team.model";
import User from "../users/user.model";
import Service from "../../services";

import lodash from "lodash";
const _ = lodash;

export const getAll = async (req, res) => {
  try {
    // CONFIG
    const config = {
      FIELDS_TO_RETURN: ["name", "tag", "captain", "ftw_id", "is_national_team", "discord_link", "createdAt", "updatedAt"],
      OPTIONAL_FIELDS_TO_RETURN: ["members", "discord"],
      ALLOWED_FIELDS_TO_FILTER: ["name", "tag", "is_national_team", "country"],
      FIELDS_TO_SEARCH_ON: ["name", "tag"],
      FIELDS_TO_POPULATE: [{ path: "captain", select: ["name", "urt_auth", "country"] }],
      OPTIONAL_FIELDS_TO_POPULATE: [{ path: "members.user", select: ["name", "urt_auth", "country"] }],
      DEFAULT_SORT: { by: "name", sens: "asc" },
    };
    const params = _.pick(req.query, ["search", "limit", "page", "sortBy", "sortSens", "name", "tag", "country", "is_national_team", "include_members", "include_discord"]);

    const { metadata, content } = await Service.getAll(Team, config, params);

    res.status(200).json({ metadata, content });
  } catch (error) {
    throw new Error(error);
  }
};

export const get = async (req, res, next) => {
  try {
    const config = {
      FIELDS_TO_RETURN: ["name", "tag", "country", "captain", "members", "ftw_id", "discord_link", "is_national_team", "createdAt", "updatedAt"],
      OPTIONAL_FIELDS_TO_RETURN: ["discord"],
      FIELDS_TO_POPULATE: [
        { path: "captain", select: ["name", "urt_auth", "country"] },
        { path: "members.user", select: ["name", "urt_auth", "country"] },
      ],
      OPTIONAL_FIELDS_TO_POPULATE: [],
    };

    const params_query = _.pick(req.query, ["include_discord"]);
    const params_params = _.pick(req.params, ["id"]);
    const params = _.merge({}, params_params, params_query);

    const team = await Service.get(Team, config, params);
    res.json({ content: team });
  } catch (error) {
    next(new Error(error));
  }
};

export const store = async (req, res, next) => {
  try {
    // TEAMS CREATION
    const { name, tag, country, captain, roster_message_id, role_id, discord_link, ftw_id, is_national_team } = req.body;
    const datas = {
      name,
      tag,
      country,
      captain,
      discord: {
        roster_message_id,
        role_id,
      },
      members: [
        {
          user: captain,
          role: "admin",
          joined_at: Date.now(),
        },
      ],
      discord_link,
      ftw_id,
      is_national_team,
    };
    const newTeam = await Team.create(datas);

    // ADDING TEAM TO CAPTAINS
    const user = await User.findById(newTeam.captain);
    console.log(user);
    await user.addTeam(newTeam.id, "admin");
    user.save();

    res.json({ newTeam });
  } catch (error) {
    next(new Error(error));
  }
};

export const update = async (req, res, next) => {
  try {
    const { name, tag, country, captain, roster_message_id, role_id, discord_link, ftw_id, is_national_team } = req.body;
    const datas = {
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

    const initialTeam = await Team.findById(req.params.id);
    const currentCaptain = initialTeam.captain;
    const updatedTeam = _.merge(initialTeam, datas);

    if (currentCaptain !== updatedTeam.captain) {
      await updatedTeam.updateMember(updatedTeam.captain, "admin");
      const user = await User.findById(updatedTeam.captain);
      await user.updateTeam(updatedTeam.id, "admin");
      user.save();
    }
    updatedTeam.save();

    res.json({ content: { initialTeam, updatedTeam } });
  } catch (error) {
    next(new Error(error));
  }
};

export const destroy = async (req, res, next) => {
  try {
    // REMOVE TEAM FROM ALL MEMBERS
    const team = await Team.findById(req.params.id);
    for (const member of team.members) {
      const user = await User.findById(member.user);
      await user.removeTeam(req.params.id);
      user.save();
    }

    // DELETE TEAM
    const deletedTeam = await Team.findOneAndDelete({ _id: req.params.id });
    res.json({ content: deletedTeam });
  } catch (error) {
    next(new Error(error));
  }
};

//

export const addMember = async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.params.userId;
    const role = Boolean(req.query.invite) === true ? "invited" : "member";

    const team = await Team.findById(teamId);
    const user = await User.findById(userId);
    await team.addMember(userId, role);
    await user.addTeam(teamId, role);
    team.save();
    user.save();

    res.json({ content: { team, user } });
  } catch (error) {
    next(new Error(error));
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params;
    const team = await Team.findById(teamId);
    const user = await User.findById(userId);
    await team.removeMember(userId);
    await user.removeTeam(teamId);
    team.save();
    user.save();

    res.json({ content: { team, user } });
  } catch (error) {
    next(new Error(error));
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params;
    const { is_active, role } = req.body;
    const team = await Team.findById(teamId);
    const user = await User.findById(userId);
    await team.updateMember(userId, role, is_active);
    await user.updateTeam(teamId, role, is_active);
    team.save();
    user.save();

    res.json({ content: { team, user } });
  } catch (error) {
    next(new Error(error));
  }
};
