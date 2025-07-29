import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  //1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password!",
    });
  }
  //2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }
  //3) If everything is ok, send token to client
  createSendToken(user, 200, res);
};

export const googleLogin = async (req, res, next) => {
  const { tokenId } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const { email_verified, email, name } = ticket.getPayload();
  if (!email_verified) {
    return res.status(400).json({
      stauts: "fail",
      message: "Email not verified by Google. Please use a verified email.",
    });
  }
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      googleId: ticket.getPayload().sub,
      role: "candidate",
      password: email + process.env.GOOGLE_CLIENT_ID, // Temporary password
      passwordConfirm: email + process.env.GOOGLE_CLIENT_ID,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    await user.save();
  }
  createSendToken(user, 200, res);
};

export const logout = async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please log in to get access.",
    });
  }
  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message: "The user belonging to this token does no longer exist.",
    });
  }
  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: "fail",
      message: "User recently changed password! Please log in again.",
    });
  }
  //Grant access to protected route
  req.user = currentUser;
  next();
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  //1) Get user based on posted email
  const user = await User.findOne({ email });
};
