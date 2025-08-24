import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import Job from "../model/jobModel.js";
import Application from "../model/applicationModel.js";
import User from "../model/userModel.js";
import { Questionnaire, Talent } from "../model/formModel.js";

// Admin Dashboard
export const getAdminDashboard = catchAsync(async (req, res, next) => {
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const totalUsers = await User.find({
    role: { $ne: "admin" },
  }).countDocuments(); // Exclude admin users
  const totalCandidates = await User.countDocuments({ role: "candidate" });
  const totalBusinessOwners = await User.countDocuments({
    role: "business owner",
  });
  const totalQuestionnaires = await Questionnaire.countDocuments();
  const totalTalents = await Talent.countDocuments();

  res.status(200).json({
    status: "success",
    data: {
      totalJobs,
      totalApplications,
      totalUsers,
      totalCandidates,
      totalBusinessOwners,
      totalQuestionnaires,
      totalTalents,
    },
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const updateUserRole = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getAllApplications = catchAsync(async (req, res, next) => {
  const applications = await Application.find()
    .populate("job", "title company location")
    .populate("user", "name email role");

  res.status(200).json({
    status: "success",
    results: applications.length,
    data: {
      applications,
    },
  });
});

export const getApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.id)
    .populate("user", "name email role")
    .populate("job", "title company location");
  if (!application) {
    return next(new AppError("No application found with that ID", 404));
  }
  if (
    req.user.role === "candidate" &&
    req.user.id !== application.user._id.toString()
  ) {
    return next(
      new AppError("You are not authorized to view this application", 403)
    );
  } else if (req.user.role === "business owner") {
    // Block all access for business owners
    return next(
      new AppError("Business owners cannot view applications directly", 403)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      application,
    },
  });
});

export const updateApplicationStatus = catchAsync(async (req, res, next) => {
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!application) {
    return next(new AppError("No application found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      application,
    },
  });
});

export const deleteApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) {
    return next(new AppError("No application found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
