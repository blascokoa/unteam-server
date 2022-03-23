const { Schema, model } = require("mongoose");
const {getRandomCode} = require("../utils/string-generator")

const clubSchema = new Schema(
  {
    name: String,
    nif: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    code: {
      type: String,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: "Member",
    }]
  })

const Club = model("Club", clubSchema);

module.exports = Club;