export const show = async (model, id, fields, populate) => {
  const data = model.findById(id, fields);

  //POPULATE
  if (populate.length > 0) {
    populate.forEach((el) => {
      data.populate(el.id, el.fields);
    });
  }

  return await data;
};
