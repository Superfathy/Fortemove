import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { OAuth2Client } from "google-auth-library";
import Email from "../utils/email.js";
import crypto from "crypto";

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
    role: req.body.role,
  });
  // Send welcome email
  if (newUser.role === "candidate") {
    await new Email(
      newUser,
      `${req.protocol}://${req.get("host")}`
    ).sendCandidateWelcome();
  } else if (newUser.role === "business owner") {
    await new Email(
      newUser,
      `${req.protocol}://${req.get("host")}`
    ).sendLeadWelcome();
  }

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
  const { tokenId, role } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const { email_verified, email, name, sub: googleId } = ticket.getPayload();
  if (!email_verified) {
    return res.status(400).json({
      status: "fail",
      message: "Email not verified by Google. Please use a verified email.",
    });
  }
  if (!role || !["candidate", "admin", "business owner"].includes(role)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid role. Please provide a valid role.",
    });
  }
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      googleId: ticket.getPayload().sub,
      role,
      password: email + process.env.GOOGLE_CLIENT_ID, // Temporary password
      passwordConfirm: email + process.env.GOOGLE_CLIENT_ID,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    await user.save();
  }
  if (user.role === "candidate") {
    await new Email(
      user,
      `${req.protocol}://${req.get("host")}`
    ).sendCandidateWelcome();
  } else if (user.role === "business owner") {
    await new Email(
      user,
      `${req.protocol}://${req.get("host")}`
    ).sendLeadWelcome();
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
  if (!email) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide an email address.",
    });
  }
  //1) Get user based on posted email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "There is no user with this email address.",
    });
  }
  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. If you didn't forget your password, please ignore this email!`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: message,
    });
  } catch (err) {
    console.error(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      status: "fail",
      message: "There was an error sending the email. Try again later!",
    });
  }
};

export const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  //1) Get user based on the token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired.",
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
};

export const updatePassword = async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  //1) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Your current password is wrong.",
    });
  }
  //2) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
};
