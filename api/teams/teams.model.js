import mongoose from "mongoose";

const Schema = mongoose.Schema;
const teamsSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    captain: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "users",
        },
        is_active: {
          type: Boolean,
          default: true,
        },
        role: {
          type: Object,
          enum: ["admin", "member", "invited"],
          default: "invited",
        },
        joined_at: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],
    discord: {
      roster_message_id: {
        type: Number,
      },
      role_id: {
        type: Number,
      },
    },
    discord_link: {
      type: String,
    },
    ftw_id: {
      type: Number,
    },
    is_national_team: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("teams", teamsSchema);
