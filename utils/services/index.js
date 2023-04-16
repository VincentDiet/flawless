export const index = async (model, params) => {
  const { fields, sort, search, filters, pagination, populate } = params;

  const datas = await model.find(filters, fields).find(search).sort(sort).limit(pagination.limit).skip(pagination.skip).populate(populate);
  const totalCount = await model.count();

  const informations = {
    returned: datas.length,
    total: totalCount,
    totalPage: pagination.limit === 0 ? 1 : Math.ceil(totalCount / pagination.limit),
    currentPage: pagination.limit === 0 ? 1 : pagination.page,
  };

  return { success: true, informations, datas: datas };
};
