const { Schema, model } = require("mongoose");

const publicationSchema = new Schema(
  {
    title: String,
    message: String,
    clubOwner: {
      type: Schema.Types.ObjectId,
      ref: "Club",
    },
    readers: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  })

const Publication = model("Publication", publicationSchema);

module.exports = Publication;