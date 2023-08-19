const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const managerSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    gender: String,
    date_of_birth: String,
    phone: String,
    username: String,
    status: { type: String, enum: ["active", "inactive"] },
    role: { type: String, enum: "manager", default: "manager" },
    added_by: String,
    token: String,
  },
  {
    timestamps: true,
  }
);

managerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password everytime its saved
managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Manager = new mongoose.model("Manager", managerSchema);

module.exports = Manager;
