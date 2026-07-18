const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employerSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    industry: { type: String, default: "General" },
    website: { type: String, default: "" },
    about: { type: String, default: "" },
    logoLetter: { type: String, default: "" }, // used for the avatar tile in the UI
  },
  { timestamps: true }
);

employerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

employerSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Employer", employerSchema);
