import mongoose from "mongoose";

const Schema = mongoose.Schema;
const defaultSchema = Schema(
  {},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Default", defaultSchema);
