module.exports = class {
  static async index(fields, populate, options, filters, search) {
    const datas = this.model.find(filters, fields).find(filters).find(search);

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
    const count = await this.model.count();

    return { datas: await datas, totalPage: Math.ceil(count / (options.limit || count)), currentPage: Number(options.page || 1) };
  }

  static async show(id, fields, populate) {
    const data = this.model.findById(id, fields);

    POPULATE
    if (populate.length > 0) {
      populate.forEach((el) => {
        data.populate(el.id, el.fields);
      });
    }

    return await data;
  }
};
