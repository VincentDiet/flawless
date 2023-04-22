import mongoose from "mongoose";

const Schema = mongoose.Schema;
const teamSchema = Schema(
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
      ref: "User",
    },
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
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
      default: null,
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

teamSchema.methods.addMember = async function (memberId, role) {
  const memberExists = this.members.some((member) => member.user.equals(memberId));
  if (memberExists) {
    throw new Error("This player is already in the team or is already invited");
  }
  this.members.push({ user: memberId, role });
};

teamSchema.methods.removeMember = async function (memberId) {
  const memberExists = this.members.some((member) => member.user.equals(memberId));
  if (!memberExists) {
    throw new Error("This player is not in this team.");
  }
  if (this.captain.equals(memberId)) {
    throw new Error("The captain cannot leave the team.");
  }
  this.members = this.members.filter((member) => !member.user.equals(memberId));
};

teamSchema.methods.updateMember = async function (memberId, role, is_active) {
  const memberExists = this.members.some((member) => member.user.equals(memberId));
  if (!memberExists) {
    throw new Error("This player is not in this team.");
  }
  if (typeof this.captain === "object" && this.captain !== null && this.captain.equals(memberId)) {
    if (role !== "admin" && role !== undefined) {
      throw new Error("You cannot remove admin's role from team's captain.");
    }
  }
  const user = this.members.find((member) => member.user.equals(memberId));
  user.role = role || user.role;
  user.is_active = is_active || user.is_active;
};

export default mongoose.model("Team", teamSchema);
