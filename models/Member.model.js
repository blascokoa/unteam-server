const { Schema, model } = require("mongoose");

const memberSchema = new Schema(
  {
    name: String,
    surname: String,
    birthday: Date,
    category: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

const Member = model("Member", memberSchema);

module.exports = Member;