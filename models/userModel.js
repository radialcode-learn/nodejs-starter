const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please tell us your name"] },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    vadilate: {
      validator: (obj) => validator.isEmail(obj.email),
      message: "Please provide a valid email",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  /**
   * Encrypt and hash the password with a cost of 12
   */
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Instance method - Available on all the documents on a certain collection
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password does not work as we've
  // select = false
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
