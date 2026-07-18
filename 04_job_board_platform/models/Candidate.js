const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    headline: { type: String, default: "" }, // e.g. "Frontend Developer"
    skills: [{ type: String }],
    location: { type: String, default: "" },
    experienceYears: { type: Number, default: 0 },
  },
  { timestamps: true }
);

candidateSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

candidateSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Candidate", candidateSchema);
