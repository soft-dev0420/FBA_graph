import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import TableComponent from '../components/TableComponent';
import { fetchExcelData } from '../redux/reducers/excelReducer';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';

const TablePage = () => {
  const [fileName, setFileName] = useState('');
  const dispatch = useDispatch();
  const { isLoading, data: excelData, error } = useSelector((state) => state.excel);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const asins = jsonData.map(row => row[0]).filter(Boolean);

        if (asins.length > 0) {
          dispatch(fetchExcelData({ asins, country: 'IN' }));
        } else {
          console.warn('No ASINs found in the uploaded file.');
        }
      } catch (err) {
        console.error('Error processing Excel file:', err);
      }
    };

    reader.onerror = (err) => {
      console.error('Error reading file:', err);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Container fluid className="py-2 min-vh-80">
      <Row className="justify-content-center">
        <Col xs={12} xl={10}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center rounded-top py-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-table fs-3 me-2"></i>
                <h4 className="mb-0">ASIN Data Viewer</h4>
              </div>
              {excelData.length > 0 && (
                <Badge bg="light" text="primary" className="fs-6 fw-medium shadow-sm px-3 py-2 rounded-pill">
                  <i className="bi bi-file-earmark-excel me-1"></i>
                  {fileName}
                </Badge>
              )}
            </Card.Header>

            <Card.Body className="bg-white rounded-bottom p-4">
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <h4 className="text-secondary mt-3">Fetching ASIN Data from Amazon...</h4>
                  <p className="text-muted">Please wait while we process your data.</p>
                </div>
              ) : error ? (
                 <div className="text-center py-5">
                    <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
                    <h4 className="text-danger mt-3 mb-2">An Error Occurred</h4>
                    <p className="text-muted mb-4">{typeof error === 'object' ? JSON.stringify(error) : error}</p>
                    <label htmlFor="fileInputError">
                      <Button variant="primary" size="lg" as="span">
                        <i className="bi bi-upload me-2"></i>
                        Upload a Different File
                      </Button>
                    </label>
                    <input
                      type="file"
                      className="d-none"
                      id="fileInputError"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                    />
                </div>
              ) : excelData.length === 0 ? (
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
                  <div className="table-responsive">
                    <TableComponent data={excelData}/>
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
