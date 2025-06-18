import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import Table from '../components/Table';
import { setExcelData } from '../redux/reducers/excelReducer';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablePage = () => {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('');
  const dispatch = useDispatch();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setData(jsonData);
      dispatch(setExcelData(jsonData));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-primary text-white py-4 rounded-top">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-table me-2"></i>
                  Excel Data Viewer
                </h4>
                {data.length > 0 && (
                  <span className="badge bg-white text-primary fw-medium">
                    <i className="bi bi-file-earmark-excel me-1"></i>
                    {fileName}
                  </span>
                )}
              </div>
            </div>

            <div className="card-body p-4 bg-white rounded-bottom">
              {data.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-file-earmark-excel text-primary" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h4 className="text-secondary mb-3">No Excel File Loaded</h4>
                  <p className="text-muted mb-4">Start by uploading a spreadsheet to visualize your data.</p>
                  <label htmlFor="fileInput" className="btn btn-lg btn-primary">
                    <i className="bi bi-upload me-2"></i>
                    Upload Excel File
                  </label>
                  <input
                    type="file"
                    className="d-none"
                    id="fileInput"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                  />
                  <p className="text-muted mt-3 small">
                    Supported formats: <strong>.xlsx</strong>, <strong>.xls</strong>
                  </p>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <label htmlFor="fileInput" className="btn btn-outline-primary">
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Upload Another File
                    </label>
                    <input
                      type="file"
                      className="d-none"
                      id="fileInput"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                    />
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Click rows to inspect data
                    </small>
                  </div>
                  <Table data={data} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
