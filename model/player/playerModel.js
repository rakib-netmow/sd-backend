const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const playerSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    team: String,
    token: String,
    fees: String,
    name: String,
    gender: String,
    date_of_birth: String,
    address_line_1: String,
    address_line_2: String,
    country: String,
    city: String,
    state: String,
    zip: Number,
    phone: String,
    height: String,
    weight: String,
    added_by: String,
    role: { type: String, enum: "player", default: "player" },
  },
  {
    timestamps: true,
  }
);

playerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password everytime its saved
playerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Player = new mongoose.model("Player", playerSchema);

module.exports = Player;
