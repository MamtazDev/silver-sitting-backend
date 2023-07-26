const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["childCareProvider", "parent"],
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    postCode: {
      type: Number,
      required: true,
    },
    residance: {
      type: String,
      required: true,
    },
    streetOrHouseNumber: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
      default: "fkljsklfklsfkljsf",
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
