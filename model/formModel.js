import mongoose from "mongoose";
import validator from "validator";

const questionnaireSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    trim: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  phone: String,
  companySize: {
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
  },
  companyType: {
    type: String,
    enum: ["Startup", "SME", "Enterprise", "Freelancer", "Other"],
  },
  companyIndustry: {
    type: String,
    required: [true, "Please provide your company industry"],
    trim: true,
  },
  companyLocation: {
    type: String,
    required: [true, "Please provide your company location"],
    trim: true,
  },
  positionNeeded: {
    type: String,
    required: [true, "Please provide the position needed"],
    trim: true,
  },
  yearsOfExperience: {
    type: String,
    enum: ["0-1 year", "1-3 years", "3-5 years", "5+ years"],
  },
  workModel: {
    type: String,
    enum: ["Remote", "On-site", "Hybrid"],
    required: [true, "Please specify the work model"],
  },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    required: [true, "Please specify the employment type"],
  },
});

const talentFormSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    trim: true,
    lowercase: true,
    unique: true,
  },
  name: String,
  phone: String,
  profession: String,
  experience: {
    type: String,
    enum: ["0-1 year", "1-3 years", "3-5 years", "5+ years"],
  },
  cvUrl: {
    type: String,
    required: [true, "Please upload your CV"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Questionnaire = mongoose.model(
  "Questionnaire",
  questionnaireSchema
);
export const Talent = mongoose.model("Talent", talentFormSchema);
