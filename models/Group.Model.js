const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    name: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Club",
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: "Member"
    }],
  },
  {
    timestamps: true,
  }
);

const Group = model("Group", groupSchema);

module.exports = Group;