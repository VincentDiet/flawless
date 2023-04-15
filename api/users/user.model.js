import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = Schema(
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
          ref: "Team",
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

export default mongoose.model("User", userSchema);
