const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const guardianSchema = new mongoose.Schema(
  {
    email: String,
    name: String,
    phone: String,
    address_line_1: String,
    address_line_2: String,
    country: String,
    city: String,
    state: String,
    zip: Number,
    password: String,
    role: { type: String, enum: "guardian", default: "guardian" },
    added_by: String,
    token: String,
  },
  {
    timestamps: true,
  }
);

guardianSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password everytime its saved
guardianSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Guardian = new mongoose.model("Guardian", guardianSchema);

module.exports = Guardian;
