import Job from "../model/jobModel.js";
import Application from "../model/applicationModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { promisify } from "util";
import fs from "fs";

export const getAllJobs = catchAsync(async (req, res) => {
  const jobs = await Job.find({ active: true }).sort({ createdAt: -1 });
  if (jobs.length === 0) {
    return next(new AppError("No jobs found", 404));
  }

  res.status(200).json({
    status: "success",
    results: jobs.length,
    data: {
      jobs,
    },
  });
});

export const getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

export const createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      job: newJob,
    },
  });
});

export const updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

export const deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true, runValidators: true }
  );
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const applyForJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  const existingApplication = await Application.findOne({
    job: req.params.id,
    user: req.user.id,
  });
  if (existingApplication) {
    await promisify(fs.unlink)(req.file.path); // Delete the uploaded file if application already exists
res.status(400).json({
  status: "fail",
  message: "You have already applied for this job",
});
  }
  const application = await Application.create({
    job: req.params.id,
    user: req.user.id,
    name: req.body.name,
    email: req.body.email,
    cvUrl: req.file.path,
    coverLetter: req.body.coverLetter,
  });
  res.status(201).json({
    status: "success",
    data: {
      application,
    },
  });
});

// Get all applications for the logged-in candidate
export const getMyApplications = catchAsync(async (req, res, next) => {
  console.log('User ID:', req.user.id); // Debug log
  
  const applications = await Application.find({ user: req.user.id })
    .populate('job', 'title company location salary')
    .sort({ appliedAt: -1 });

  console.log('Found applications:', applications.length); // Debug log

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: { 
      applications 
    }
  });
});

// Get a specific application for the logged-in candidate
export const getMyApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('job', 'title company location salary');

  if (!application) {
    return next(new AppError('No application found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { application }
  });
});
export const candidateDashboard = catchAsync(async (req, res, next) => {
  const totalApplications = await Application.countDocuments({ user: req.user.id });
  const acceptedApplications = await Application.countDocuments({ user: req.user.id, status: 'accepted' });
  const pendingApplications = await Application.countDocuments({ user: req.user.id, status: 'pending' });
  const rejectedApplications = await Application.countDocuments({ user: req.user.id, status: 'rejected' });
  const reviewedApplications = await Application.countDocuments({ user: req.user.id, status: 'reviewed' });

  res.status(200).json({
    status: "success",
    data: {
      totalApplications,
      acceptedApplications,
      pendingApplications,
      rejectedApplications,
      reviewedApplications
    }
  });
});

