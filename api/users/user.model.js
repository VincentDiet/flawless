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

userSchema.methods.addTeam = async function (teamId, role) {
  const teamExists = this.teams.some((team) => team.team.equals(teamId));
  if (teamExists) {
    throw new Error("This player is already in the team or is already invited");
  }
  this.teams.push({ team: teamId, role });
};

userSchema.methods.removeTeam = async function (teamId) {
  const teamExists = this.teams.some((team) => team.team.equals(teamId));
  if (!teamExists) {
    throw new Error("This player is not in this team.");
  }
  this.teams = this.teams.filter((team) => !team.team.equals(teamId));
};

userSchema.methods.updateTeam = async function (teamId, role, is_active) {
  const teamExists = this.teams.some((team) => team.team.equals(teamId));
  if (!teamExists) {
    throw new Error("This player is not in this team.");
  }
  const team = this.teams.find((team) => team.team.equals(teamId));
  team.role = role || team.role;
  team.is_active = is_active || team.is_active;
};

export default mongoose.model("User", userSchema);
