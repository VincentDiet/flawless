import lodash from "lodash";
const _ = lodash;

export const buildQueryParams = (query, params) => {
  // FIELDS
  const fields = params.fields;
  params.optionalFields.forEach((optionalField) => {
    const propertyName = "include_" + optionalField;
    if (query[propertyName] === "true") {
      fields.push(optionalField);
    }
  });

  // SORT
  const sort = {};
  sort[query.sortBy || params.defaultSort.sortBy] = query.sortSens || params.defaultSort.sortSens;

  // SEARCH
  const search = {};
  if (query?.search) {
    const $or = [];
    params.searchFields.forEach((searchField) => {
      let temp = {};
      temp[searchField] = { $regex: new RegExp(`.*${query.search}.*`), $options: "i" };
      $or.push(temp);
    });
    search.$or = $or;
  }

  // FILTERS
  const filters = _.pick(query, params.allowedFilters);

  // PAGINATION
  const limit = parseInt(query.limit);
  const page = parseInt(query.page);
  const pagination = {
    limit: limit || 0,
    page: page || 1,
    skip: (page - 1) * limit || 0,
  };

  // POPULATE
  let populate = [];
  if (params.populateFields.length < 0) {
    populate = null;
  } else {
    params.populateFields.forEach((populateField) => {
      const propertyName = "include_" + populateField.fields;
      if (!populateField.isOptional || Boolean(query[propertyName]) === true) {
        populate.push(populateField.populateOn);
      }
      populate.join(" ");
    });
  }

  return { fields, sort, search, filters, pagination, populate };
};
