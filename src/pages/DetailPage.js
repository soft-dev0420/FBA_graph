import React from 'react';
import { useSelector } from 'react-redux';
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
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DetailPage = () => {
  const navigate = useNavigate();
  const { selectedRow, data } = useSelector((state) => state.excel);

  if (!selectedRow || !data.length) {
    return (
      <div className="modern-container text-center py-5">
        <div className="modern-empty card p-5 shadow-sm">
          <div className="display-1 text-muted">
            <i className="bi bi-box"></i>
          </div>
          <h2 className="mt-3">No Product Selected</h2>
          <p className="text-muted">Please select a product from the table to view its details</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>↩ Back to Products</button>
        </div>
      </div>
    );
  }

  const headers = data[0];
  const rowData = data[selectedRow + 1];

  const renderValue = (header, value) => {
    if (header === "Product URL") {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-box-arrow-up-right me-1"></i> View Product
        </a>
      );
    }
    if (header === "Image URL") {
      return (
        <div className="modern-image-wrapper">
          <img src={value} alt="Product" className="img-fluid rounded shadow-sm mb-2" onError={(e) => {
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

  const rankChart = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Rank Over Time',
        data: chartData,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>← Back</button>
        <h1 className="h3 mb-0">Product Details</h1>
      </div>

      <div className="row">
        <div className="col-md-7">
          {nameIndex !== -1 && <h2 className="mb-3 fw-bold">{rowData[nameIndex]}</h2>}
          <div className="mb-4">
            {priceIndex !== -1 && <div className="mb-2"><strong>Price:</strong> {renderValue(headers[priceIndex], rowData[priceIndex])}</div>}
            {rankIndex !== -1 && <div className="mb-2"><strong>Rank:</strong> {renderValue(headers[rankIndex], rowData[rankIndex])}</div>}
            {urlIndex !== -1 && <div className="mb-2">{renderValue(headers[urlIndex], rowData[urlIndex])}</div>}
          </div>

          <div className="mb-4">
            <h5 className="border-bottom pb-2 mb-3 text-primary">Rank Trend</h5>
            <Line data={rankChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>

          {Object.entries(sections).map(([title, keys]) => (
            keys.length > 0 && (
              <div key={title} className="mb-4">
                <h5 className="border-bottom pb-2 mb-3 text-primary">{title}</h5>
                <div className="row g-3">
                  {keys.map((header, index) => (
                    <div key={index} className="col-sm-6">
                      <div className="border p-3 rounded shadow-sm h-100">
                        <div className="fw-semibold text-muted small mb-1">{header}</div>
                        <div>{renderValue(header, rowData[headers.indexOf(header)])}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <div className="col-md-5">
          <h5 className="border-bottom pb-2 mb-3 text-primary">Product Images</h5>
          <div className="row g-3">
            {imageFields.map(({ header, value }, index) => (
              <div key={index} className="col-6">
                <div className="border rounded p-2 h-100 text-center">
                  <img
                    src={value}
                    alt={header}
                    className="img-fluid rounded mb-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                  <small className="text-muted d-block">{header}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
