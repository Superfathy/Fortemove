import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { importApplications, exportApplications, getExportTemplate } from '../../services/api';

const ImportExport = () => {
  const [importFile, setImportFile] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    jobId: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    format: 'excel'
  });

  const handleFileSelect = (e) => {
    setImportFile(e.target.files[0]);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await importApplications(formData);
      
      toast.success(response.data.message);
      
      if (response.data.errors && response.data.errors.length > 0) {
        console.warn('Import errors:', response.data.errors);
        toast.warning(`${response.data.errorCount} rows had errors`);
      }
      
      setImportFile(null);
      document.getElementById('file-input').value = '';

    } catch (error) {
      toast.error(error.response?.data?.message || 'Import failed');
    } finally {
      setImportLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await exportApplications(exportFilters);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `applications_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error('Export failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setExportLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await getExportTemplate();
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'application_import_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Import/Export Applications</h1>
      </div>

      <div className="import-export-container">
        {/* Import Section */}
        <div className="import-section">
          <h2>Import Applications</h2>
          <div className="import-card">
            <div className="import-info">
              <h4>Import from Excel/CSV</h4>
              <p>Upload a spreadsheet file to import applications into the system.</p>
              <button onClick={downloadTemplate} className="btn btn-sm btn-info">
                Download Template
              </button>
            </div>
            
            <form onSubmit={handleImport} className="import-form">
              <div className="form-group">
                <label htmlFor="file-input">Select File</label>
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  required
                />
                <small>Supported formats: .xlsx, .xls, .csv</small>
              </div>
              
              {importFile && (
                <div className="file-info">
                  <strong>Selected file:</strong> {importFile.name}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={importLoading || !importFile}
              >
                {importLoading ? 'Importing...' : 'Import Applications'}
              </button>
            </form>
          </div>
        </div>

        {/* Export Section */}
        <div className="export-section">
          <h2>Export Applications</h2>
          <div className="export-card">
            <div className="export-filters">
              <div className="form-group">
                <label>Job</label>
                <select
                  value={exportFilters.jobId}
                  onChange={(e) => setExportFilters({...exportFilters, jobId: e.target.value})}
                >
                  <option value="all">All Jobs</option>
                  {/* You would populate this with actual jobs from your API */}
                </select>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={exportFilters.status}
                  onChange={(e) => setExportFilters({...exportFilters, status: e.target.value})}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Date From</label>
                <input
                  type="date"
                  value={exportFilters.dateFrom}
                  onChange={(e) => setExportFilters({...exportFilters, dateFrom: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Date To</label>
                <input
                  type="date"
                  value={exportFilters.dateTo}
                  onChange={(e) => setExportFilters({...exportFilters, dateTo: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Format</label>
                <select
                  value={exportFilters.format}
                  onChange={(e) => setExportFilters({...exportFilters, format: e.target.value})}
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleExport}
              className="btn btn-success"
              disabled={exportLoading}
            >
              {exportLoading ? 'Exporting...' : 'Export Applications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;