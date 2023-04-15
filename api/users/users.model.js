import mongoose from "mongoose";

const Schema = mongoose.Schema;
const usersSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    urt_auth: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    discord_id: {
      type: Number,
      required: true,
    },
    teams: [
      {
        team: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "teams",
        },
        is_active: {
          type: Boolean,
          default: true,
        },
        role: {
          type: Object,
          enum: ["admin", "member", "invited"],
          default: "member",
        },
        joined_at: {
          type: Date,
          required: true,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", usersSchema);