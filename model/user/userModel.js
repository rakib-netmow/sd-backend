const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  sports_category: { type: String },
  theme: { type: String},
  organisation_name: { type: String},
  subdomain: { type: String, unique: true, required:true},
  email: { type: String, unique: true, required:true},
  phone: { type: String, required:true},
  location: { type: String, required:true},
  password: { type: String, required: true },
  token: String,
  role: { type: String, enum: ["gaurdian", "admin"], default: "admin" },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password everytime its saved
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
