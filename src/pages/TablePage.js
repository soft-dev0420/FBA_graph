import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import Table from '../components/Table';
import { setExcelData } from '../redux/reducers/excelReducer';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';

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
    <Container fluid className="py-5 bg-light min-vh-100">
      <Row className="justify-content-center">
        <Col xs={12} xl={10}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center rounded-top py-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-table fs-3 me-2"></i>
                <h4 className="mb-0">Excel Data Viewer</h4>
              </div>
              {data.length > 0 && (
                <Badge bg="light" text="primary" className="fs-6 fw-medium shadow-sm px-3 py-2 rounded-pill">
                  <i className="bi bi-file-earmark-excel me-1"></i>
                  {fileName}
                </Badge>
              )}
            </Card.Header>

            <Card.Body className="bg-white rounded-bottom p-4">
              {data.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-file-earmark-excel text-primary" style={{ fontSize: '4rem' }}></i>
                  <h4 className="text-secondary mt-3 mb-2">No Excel File Loaded</h4>
                  <p className="text-muted mb-4">Start by uploading a spreadsheet to visualize your data.</p>
                  <label htmlFor="fileInput">
                    <Button variant="primary" size="lg" as="span">
                      <i className="bi bi-upload me-2"></i>
                      Upload Excel File
                    </Button>
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
                    <label htmlFor="fileInput">
                      <Button variant="outline-primary" as="span">
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Upload Another File
                      </Button>
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
                  {/* Table should be a nice looking table! */}
                  <div className="table-responsive">
                    <Table data={data} />
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TablePage;
