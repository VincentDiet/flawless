export const searchMaker = (search, fields) => {
  if (typeof search === "undefined") {
    return {};
  }

  let searchFields = [];

  fields.forEach((field) => {
    let temp = {};
    temp[field] = { $regex: new RegExp(`.*${search}.*`), $options: "i" };
    searchFields.push(temp);
  });

  const searchFilter = {
    $or: searchFields,
  };

  return searchFilter;
};
