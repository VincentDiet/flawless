import { fieldsParamBuilder, populateParamBuilder } from "../helpers/queryParamsBuilders";

export default async (model, config, params) => {
  try {
    const fields = fieldsParamBuilder(params, config.FIELDS_TO_RETURN, config.OPTIONAL_FIELDS_TO_RETURN);
    const populate = populateParamBuilder(params, config.FIELDS_TO_POPULATE, config.OPTIONAL_FIELDS_TO_POPULATE);

    const content = await model.findById(params.id, fields).populate(populate);

    if (content == null) {
      throw new Error("This " + model.name + " does not exist.");
    }

    return content;
  } catch (error) {
    throw new Error(error);
  }
};
