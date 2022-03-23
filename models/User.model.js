const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: String,
    requestedReset: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    onClub: {
      type: Schema.Types.ObjectId,
      ref: "Club"
    },
    role: {
      type: String,
      enum: ["admin", "member", "superAdmin"]
    },
    contactDetails: {
      fullName: String,
      profilePic: {
        type: String,
        default: ""
      },
      address: String,
      phone: String,
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
