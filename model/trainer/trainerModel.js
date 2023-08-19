const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const trainerSchema = new mongoose.Schema(
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

trainerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password everytime its saved
trainerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Trainer = new mongoose.model("Trainer", trainerSchema);

module.exports = Trainer;
