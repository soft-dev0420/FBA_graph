import React, { useRef, useState } from "react";
import * as XLSX from 'xlsx';
import Table from "../components/Table";
import 'bootstrap/dist/css/bootstrap.min.css';

const TablePage = () => {
  const fileInputRef = useRef();
  const [tabledata, setTableData] = useState([]);

  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      setTableData(rows.filter(row=>row[0] !==''));
    };

    reader.readAsArrayBuffer(file);
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Excel Data Viewer</h2>
              <div className="d-flex align-items-center">
                <button 
                  onClick={handleButtonClick}
                  className="btn btn-primary"
                >
                  <i className="bi bi-file-earmark-excel me-2"></i>
                  Import Excel File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{display: 'none'}}
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />
                {tabledata.length > 0 && (
                  <span className="ms-3 text-success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    File loaded successfully
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <Table data={tabledata} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TablePage;