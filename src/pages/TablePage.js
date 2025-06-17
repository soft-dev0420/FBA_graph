import React, { useRef, useState } from "react";
import * as XLSX from 'xlsx';
import Table from "../components/Table";

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
      setTableData(rows.filter(row=>row[0]!==''));
    };

    reader.readAsArrayBuffer(file);
  }

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };
  return (
    <div>
      <div>
        <button onClick={handleButtonClick}>
          Import Excel File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{display: 'none'}}
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>
      <Table data={tabledata} />
    </div>
  )
}

export default TablePage;