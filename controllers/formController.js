import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Questionnaire, Talent } from "../model/formModel.js";

// Business Form Submission

export const submitBusinessForm = catchAsync(async (req, res, next) => {
  const form = await Questionnaire.create({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    title: req.body.title,
    companySize: req.body.companySize,
    companyType: req.body.companyType,
    companyIndustry: req.body.companyIndustry,
    companyLocation: req.body.companyLocation,
    positionNeeded: req.body.positionNeeded,
    yearsOfExperience: req.body.yearsOfExperience,
    workModel: req.body.workModel,
    employmentType: req.body.employmentType,
  });

  res.status(201).json({
    status: "success",
    data: {
      form,
    },
  });
});

// Talent Form Submission
export const submitTalentForm = catchAsync(async (req, res, next) => {
  const form = await Talent.create({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    profession: req.body.profession,
    experience: req.body.experience,
    cvUrl: req.file.path,
  });

  res.status(201).json({
    status: "success",
    data: {
      form,
    },
  });
});

// Get all Business Forms
export const getAllQuestionnaires = catchAsync(async (req, res, next) => {
  const forms = await Questionnaire.find();

  res.status(200).json({
    status: "success",
    results: forms.length,
    data: {
      forms,
    },
  });
});

// Get all Talent Forms
export const getAllTalents = catchAsync(async (req, res, next) => {
  const talents = await Talent.find();

  res.status(200).json({
    status: "success",
    results: talents.length,
    data: {
      talents,
    },
  });
});

export const deleteTalent = catchAsync(async (req, res, next) => {
  const talent = await Talent.findByIdAndDelete(req.params.id);
  if (!talent) {
    return next(new AppError("No talent found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const deleteQuestionnaire = catchAsync(async (req, res, next) => {
  const form = await Questionnaire.findByIdAndDelete(req.params.id);
  if (!form) {
    return next(new AppError("No form found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
