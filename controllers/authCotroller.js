const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const validator = require("validator");
const AppError = require("../utils/appError");

/**
 * Signing tokens with jwt
 * @param {String} id
 * @returns
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/**
 * Signup
 */
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
  });

  /**
   * Creating JWT tokens
   */
  const token = signToken(newUser._id);
  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

/**
 * Login
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if the user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next();
  }
  // 2) If everything is ok, send token to client
  const token = signToken(user._id);
  // secure makes sure the cookie is only sent in https Secure connection
  res.cookie("jwt", token, {
    expires: new Date(Date.now + 90 * 24 * 60 * 1000),
    // secure: true,
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});

/**
 * Protecting routes
 */
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else next();

  // 2) Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log({ decoded });

  // 3) Check if the user exists
  const userFound = await User.findById(decoded.id);
  if (!userFound) next();
  // 4) Check if user changed password after the token is issued
  // This can be done by simply comparing the timestamps of password changed at & decoded.iat
  next();
});
