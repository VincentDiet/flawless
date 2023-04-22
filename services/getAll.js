import { fieldsParamBuilder, searchParamBuilder, paginationParamsBuilder, populateParamBuilder } from "../helpers/queryParamsBuilders";

import lodash from "lodash";
const _ = lodash;

export default async (model, config, params) => {
  try {
    // QUERY PARAMETERS BUILDERS
    const fields = fieldsParamBuilder(params, config.FIELDS_TO_RETURN, config.OPTIONAL_FIELDS_TO_RETURN);
    const filter = _.pick(params, config.ALLOWED_FIELDS_TO_FILTER);
    const searchFilter = searchParamBuilder(params.search, config.FIELDS_TO_SEARCH_ON);
    const sort = { [params.sortBy || config.DEFAULT_SORT.by]: params.sortSens || config.DEFAULT_SORT.sens };
    const pagination = paginationParamsBuilder(params);
    const populate = populateParamBuilder(params, config.FIELDS_TO_POPULATE, config.OPTIONAL_FIELDS_TO_POPULATE);

    // QUERIES
    const totalDataCount = await model.count();
    const filteredDataCount = await model.find(filter).find(searchFilter).count();
    const content = await model
      .find(filter, fields)
      .find(searchFilter)
      .sort(sort)
      .skip(pagination.page > Math.ceil(filteredDataCount / pagination.limit) ? 0 : pagination.skip)
      .limit(pagination.limit)
      .populate(populate);

    // METADATA
    const metadata = {
      total_items: totalDataCount,
      total_items_filtered: filteredDataCount,
      items_per_page: content.length,
      current_page: pagination.page > Math.ceil(filteredDataCount / pagination.limit) || pagination.limit == 0 ? 1 : pagination.page,
      total_pages: pagination.limit === 0 ? 1 : Math.ceil(filteredDataCount / pagination.limit),
    };
    return { metadata, content };
  } catch (error) {
    throw new Error(error);
  }
};
