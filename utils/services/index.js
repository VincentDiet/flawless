export const index = async (model, fields, populate, options, filters, search) => {
  const datas = model.find(filters, fields);

  // SEARCH
  datas.find(search);

  // SORT
  const sort = {};
  sort[options.sortBy] = options.sortSens;
  datas.sort(sort);

  // LIMIT
  datas.limit(options.limit || 0);
  datas.skip(((options.page || 1) - 1) * (options.limit || 0));

  // POPULATE
  if (populate.length > 0) {
    populate.forEach((el) => {
      datas.populate(el.id, el.fields);
    });
  }

  // GET TOTAL DOCUMENTS
  const count = await model.count();

  return { datas: await datas, totalPage: Math.ceil(count / (options.limit || count)), currentPage: Number(options.page || 1) };
};
