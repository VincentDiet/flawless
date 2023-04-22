export default (model) => async (req, res, next) => {
  try {
    const currentData = await model.findById(req.params.id);
    const newData = _.merge(currentData, next.data);
    newData.save();
    res.status(200).json({ newData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
