import Application from '../model/applicationModel.js';
import Job from '../model/jobModel.js';
import User from '../model/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import XLSX from 'xlsx';

// Import applications from Excel/CSV
export const importApplications = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const importedApplications = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        // Find or create job
        let job = await Job.findOne({ title: row.jobTitle });
        if (!job && row.jobTitle) {
          job = await Job.create({
            title: row.jobTitle,
            company: row.company || 'Unknown Company',
            location: row.location || 'Remote',
            description: row.jobDescription || '',
            requirements: row.jobRequirements || ''
          });
        }

        // Find user by email or create placeholder
        let user = await User.findOne({ email: row.email });
        if (!user && row.email) {
          user = await User.create({
            name: row.name || 'Unknown Applicant',
            email: row.email,
            phone: row.phone || '',
            role: 'candidate',
            password: 'tempPassword123',
            passwordConfirm: 'tempPassword123'
          });
        }

        // Create application
        const applicationData = {
          name: row.name,
          email: row.email,
          phone: row.phone,
          coverLetter: row.coverLetter || '',
          status: row.status || 'pending',
          appliedAt: row.appliedAt ? new Date(row.appliedAt) : new Date(),
          job: job ? job._id : null,
          user: user ? user._id : null
        };

        const application = await Application.create(applicationData);
        importedApplications.push(application);
      } catch (error) {
        errors.push({
          row: i + 2, // +2 because Excel rows start at 1 and header is row 1
          error: error.message,
          data: data[i]
        });
      }
    }

    res.status(200).json({
      status: 'success',
      message: `Imported ${importedApplications.length} applications successfully`,
      importedCount: importedApplications.length,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    return next(new AppError('Error processing file: ' + error.message, 500));
  }
});

// Export applications to Excel
export const exportApplications = catchAsync(async (req, res, next) => {
  const { jobId, status, dateFrom, dateTo, format = 'excel' } = req.query;

  // Build filter
  let filter = {};
  if (jobId && jobId !== 'all') filter.job = jobId;
  if (status && status !== 'all') filter.status = status;
  if (dateFrom || dateTo) {
    filter.appliedAt = {};
    if (dateFrom) filter.appliedAt.$gte = new Date(dateFrom);
    if (dateTo) filter.appliedAt.$lte = new Date(dateTo);
  }

  const applications = await Application.find(filter)
    .populate('job', 'title company location')
    .populate('user', 'name email phone')
    .sort({ appliedAt: -1 });

  // Prepare data for export
  const exportData = applications.map(app => ({
    'Application ID': app._id,
    'Applicant Name': app.name,
    'Applicant Email': app.email,
    'Applicant Phone': app.phone,
    'Job Title': app.job?.title || 'N/A',
    'Company': app.job?.company || 'N/A',
    'Location': app.job?.location || 'N/A',
    'Cover Letter': app.coverLetter,
    'Status': app.status,
    'Applied Date': app.appliedAt.toISOString().split('T')[0],
    'Last Updated': app.updatedAt.toISOString().split('T')[0],
    'CV URL': app.cvUrl || 'N/A'
  }));

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.json');
    return res.json(exportData);
  }

  // Create Excel workbook
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');
  res.send(buffer);
});

// Get export template
export const getExportTemplate = catchAsync(async (req, res) => {
  const templateData = [{
    'name': 'John Doe',
    'email': 'john@example.com',
    'phone': '+1234567890',
    'jobTitle': 'Software Developer',
    'company': 'Tech Corp',
    'location': 'Remote',
    'coverLetter': 'I am excited to apply for this position...',
    'status': 'pending',
    'appliedAt': '2023-01-15'
  }];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=application_import_template.xlsx');
  res.send(buffer);
});