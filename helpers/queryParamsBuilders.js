export const fieldsParamBuilder = (query, fieldsToReturn, optionalFieldsToReturn) => {
  const fields = fieldsToReturn;
  optionalFieldsToReturn.forEach((optionalFieldToReturn) => {
    const propertyName = "include_" + optionalFieldToReturn;
    if (query[propertyName] === "true") {
      fields.push(optionalFieldToReturn);
    }
  });
  return fields;
};

export const searchParamBuilder = (search, fields) => {
  const searchFilter = {};
  if (search) {
    const $or = [];
    fields.forEach((field) => {
      let temp = {};
      temp[field] = { $regex: new RegExp(`.*${search}.*`), $options: "i" };
      $or.push(temp);
    });
    searchFilter.$or = $or;
  }
  return searchFilter;
};

export const paginationParamsBuilder = (query) => {
  const limit = parseInt(query.limit);
  const page = parseInt(query.page);
  return {
    limit: limit || 0,
    page: page || 1,
    skip: (page - 1) * limit || 0,
  };
};

export const populateParamBuilder = (query, fieldsToPopulate, optionalFieldsToPopulate) => {
  let fieldsToPopulate_ = fieldsToPopulate;

  optionalFieldsToPopulate.forEach((optionalFieldToPopulate) => {
    const name = optionalFieldToPopulate.path.split(".")[0];
    const queryName = "include_" + name;
    if (Boolean(query[queryName]) === true) {
      fieldsToPopulate_.push({
        path: optionalFieldToPopulate.path,
        select: optionalFieldToPopulate.select,
      });
    }
  });

  if (fieldsToPopulate_.length === 0) {
    fieldsToPopulate_ = null;
  }

  return fieldsToPopulate_;
};
