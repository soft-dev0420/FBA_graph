import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Container, Row, Col, Card, Button, Badge
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getChartData } from '../redux/reducers/excelReducer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DetailPage = () => {
  const navigate = useNavigate();
  const { selectedRow, data } = useSelector((state) => state.excel);
  const dispatch = useDispatch();

  if (!selectedRow || !data.length) {
    return (
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Card className="p-5 shadow-lg border-0 text-center">
          <div className="display-1 text-muted mb-3">
            <i className="bi bi-box"></i>
          </div>
          <h2>No Product Selected</h2>
          <p className="text-muted">Please select a product from the table to view its details.</p>
          <Button variant="primary" size="lg" className="mt-3" onClick={() => navigate('/')}>
            <i className="bi bi-arrow-left me-2"></i>Back to Products
          </Button>
        </Card>
      </Container>
    );
  }

  const headers = data[0];
  const rowData = data[selectedRow + 1];

  const renderValue = (header, value) => {
    if (header === "Product URL") {
      return (
        <Button variant="outline-primary" size="sm" href={value} target="_blank" rel="noopener noreferrer">
          <i className="bi bi-box-arrow-up-right me-1"></i> View Product
        </Button>
      );
    }
    if (header === "Image URL") {
      return (
        <div className="mb-2 text-center">
          <img src={value} alt="Product" className="img-fluid rounded shadow-sm mb-2" style={{ maxHeight: '250px' }} onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }} />
          <small className="text-muted">{value}</small>
        </div>
      );
    }
    if (typeof value === 'number') {
      return <span className="text-success fw-semibold">{value.toLocaleString()}</span>;
    }
    if (typeof value === 'string' && value.match(/^https?:\/\//)) {
      return <a href={value} target="_blank" rel="noopener noreferrer" className="text-decoration-underline">{value}</a>;
    }
    return <span>{value}</span>;
  };

  const getImportantField = (keywords) => {
    return headers.findIndex(h => keywords.some(keyword => h.toLowerCase().includes(keyword)));
  };

  const nameIndex = getImportantField(['name', 'title', 'product']);
  const priceIndex = getImportantField(['price', 'cost']);
  const rankIndex = getImportantField(['rank', 'rating', 'score']);
  const urlIndex = getImportantField(['url', 'link']);

  const imageFields = headers.reduce((acc, header, index) => {
    if (header.toLowerCase().includes('image') || header.toLowerCase().includes('picture') || header.toLowerCase().includes('photo')) {
      acc.push({ header, value: rowData[index] });
    }
    return acc;
  }, []);

  const sections = {
    'Overview': headers.filter((h, index) =>
      index !== nameIndex && index !== priceIndex && index !== rankIndex && index !== urlIndex &&
      !h.toLowerCase().includes('url') && !h.toLowerCase().includes('image') && !h.toLowerCase().includes('price') && !h.toLowerCase().includes('cost')
    ),
    'Media': headers.filter(h => h.toLowerCase().includes('url') && !h.toLowerCase().includes('image')),
    'Pricing': headers.filter(h => h.toLowerCase().includes('price') || h.toLowerCase().includes('cost'))
  };

  const chartLabels = Array.from({ length: 10 }, (_, i) => `T-${10 - i}`);
  const chartData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
  dispatch(getChartData());
  
  const rankChart = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Rank Over Time',
        data: chartData,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.15)',
        tension: 0.4,
      },
    ],
  };

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            <i className="bi bi-arrow-left me-1"></i> Back
          </Button>
        </Col>
        <Col>
          <h1 className="h3 mb-0">Product Details</h1>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={7}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              {nameIndex !== -1 && (
                <Card.Title className="mb-3 fs-2 fw-bold">
                  <i className="bi bi-box-seam me-2 text-primary"></i>
                  {rowData[nameIndex]}
                </Card.Title>
              )}
              <Row className="mb-3">
                {priceIndex !== -1 && (
                  <Col xs="auto">
                    <Badge bg="success" className="fs-6 me-2">
                      <i className="bi bi-cash-coin me-1"></i>
                      {renderValue(headers[priceIndex], rowData[priceIndex])}
                    </Badge>
                  </Col>
                )}
                {rankIndex !== -1 && (
                  <Col xs="auto">
                    <Badge bg="info" className="fs-6 me-2">
                      <i className="bi bi-bar-chart-line me-1"></i>
                      {renderValue(headers[rankIndex], rowData[rankIndex])}
                    </Badge>
                  </Col>
                )}
                {urlIndex !== -1 && (
                  <Col xs="auto">{renderValue(headers[urlIndex], rowData[urlIndex])}</Col>
                )}
              </Row>

              <Card className="bg-light mb-4">
                <Card.Body>
                  <Card.Title className="fs-6 text-primary mb-3">
                    <i className="bi bi-graph-up-arrow me-2"></i>Rank Trend
                  </Card.Title>
                  <Line data={rankChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </Card.Body>
              </Card>

              {Object.entries(sections).map(([title, keys]) => (
                keys.length > 0 && (
                  <div key={title} className="mb-4">
                    <h5 className="border-bottom pb-2 mb-3 text-primary">{title}</h5>
                    <Row className="g-3">
                      {keys.map((header, index) => (
                        <Col sm={6} key={index}>
                          <Card className="border-0 shadow-sm h-100">
                            <Card.Body>
                              <div className="fw-semibold text-muted small mb-1">{header}</div>
                              <div>{renderValue(header, rowData[headers.indexOf(header)])}</div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-3 text-primary">
                <i className="bi bi-image me-2"></i>Product Images
              </Card.Title>
              <Row className="g-3">
                {imageFields.length === 0 && (
                  <Col>
                    <div className="text-muted text-center">No images available</div>
                  </Col>
                )}
                {imageFields.map(({ header, value }, index) => (
                  <Col xs={6} key={index}>
                    <Card className="border-0 p-2 h-100 text-center shadow-sm">
                      <img
                        src={value}
                        alt={header}
                        className="img-fluid rounded mb-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                        style={{ maxHeight: '160px', objectFit: 'contain' }}
                      />
                      <small className="text-muted d-block">{header}</small>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailPage;
