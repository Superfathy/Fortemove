import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
  },
  company: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
  },
  requirements: {
    type: String,
    required: [true, "Job requirements are required"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Job location is required"],
    trim: true,
  },
  salaryVisible: {
    type: Boolean,
    default: false,
  },
  salary: {
    type: Number,
    required: function () {
      return this.salaryVisible;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  imageCover: {
    type: String,
  },
  images: [String],
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
