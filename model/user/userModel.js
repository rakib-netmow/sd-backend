const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  sports_category: { type: String },
  theme: { type: String },
  organisation_name: { type: String },
  subdomain: { type: String },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  token: String,
  role: {
    type: String,
    enum: ["gaurdian", "admin", "player"],
    default: "admin",
  },
  address_line_1: String,
  address_line_2: String,
  state: String,
  city: String,
  zip: Number,
  organizational_phone: String,
  organizational_email: String,
  header_logo: String,
  footer_logo: String,
  fav_icon: String,
  primary_color: String,
  secondary_color: String,
  currency: String,
  gst: String,
  player_registration_fee: String,
  // others [gaurdians & players]
  name: String,
  added_by: String,
  gender: String,
  date_of_birth: String,
  height: String,
  weight: String,
  team: String,
  fees: String,
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

// function isReqired(field) {
//   return function () {
//     if (field === "subdomain") {
//       console.log(this.role);
//       return this.role === "admin";
//     } else {
//       console.log(this.role);
//       return false;
//     }
//   };
// }

const User = new mongoose.model("User", userSchema);

module.exports = User;
