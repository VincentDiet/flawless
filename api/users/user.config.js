export const GET_ALL_CONFIG = {
  FIELDS_TO_RETURN: ["discord_id", "urt_auth", "name", "country", "createdAt", "updatedAt"],
  OPTIONAL_FIELDS_TO_RETURN: ["teams"],
  ALLOWED_FIELDS_TO_FILTER: ["discord_id", "name", "urt_auth", "country"],
  FIELDS_TO_SEARCH_ON: ["name", "urt_auth"],
  FIELDS_TO_POPULATE: [],
  OPTIONAL_FIELDS_TO_POPULATE: [{ path: "teams.team", select: ["name", "tag", "country", "is_national_team"] }],
  DEFAULT_SORT: { sortBy: "name", sortSens: "asc" },
};

export const GET_CONFIG = {
  FIELDS_TO_RETURN: ["name", "discord_id", "urt_auth", "country", "teams", "createdAt", "updatedAt"],
  OPTIONAL_FIELDS_TO_RETURN: [],
  FIELDS_TO_POPULATE: [{ path: "teams.team", select: ["name", "tag", "country", "is_national_team"] }],
  OPTIONAL_FIELDS_TO_POPULATE: [],
};
