import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedRow } from '../redux/reducers/excelReducer';
import 'bootstrap/dist/css/bootstrap.min.css';

const Table = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tooltipData, setTooltipData] = useState({ show: false, imageUrl: '', x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (tooltipData.show) {
        setTooltipData(prev => ({
          ...prev,
          x: e.clientX + 15,
          y: e.clientY + 15
        }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [tooltipData.show]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-table fs-1 text-muted mb-3"></i>
        <p className="text-muted">No data available. Please import an Excel file to view data.</p>
      </div>
    );
  }

  const headers = data[0];
  const rows = data.slice(1);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleRowMouseEnter = (row) => {
    const imageUrlIndex = headers.findIndex(header => header === "Image URL");
    if (imageUrlIndex !== -1 && row[imageUrlIndex]) {
      setTooltipData({
        show: true,
        imageUrl: row[imageUrlIndex],
        x: 0,
        y: 0
      });
    }
  };

  const handleRowMouseLeave = () => {
    setTooltipData(prev => ({ ...prev, show: false }));
  };

  const handleRowClick = (rowIndex) => {
    // Calculate the actual row index in the full dataset
    const actualRowIndex = (currentPage - 1) * rowsPerPage + rowIndex;
    dispatch(setSelectedRow(actualRowIndex));
    navigate('/detail');
  };

  // Filter out the Image URL column from headers and rows
  const imageUrlIndex = headers.findIndex(header => header === "Image URL");
  const filteredHeaders = headers.filter((_, index) => index !== imageUrlIndex);
  const filteredRows = paginatedRows.map(row => row.filter((_, index) => index !== imageUrlIndex));

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              {filteredHeaders.map((cell, index) => (
                <th key={index} className="text-nowrap align-middle">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                onMouseEnter={() => handleRowMouseEnter(paginatedRows[rowIndex])}
                onMouseLeave={handleRowMouseLeave}
                onClick={() => handleRowClick(rowIndex)}
                style={{ cursor: 'pointer' }}
              >
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="text-nowrap align-middle">
                    {filteredHeaders[colIndex] === "Product URL" ? (
                      <a 
                        href={cell} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i>
                        Visit
                      </a>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Tooltip */}
      {tooltipData.show && (
        <div 
          className="position-fixed bg-white border rounded shadow-lg p-2"
          style={{
            zIndex: 1000,
            left: tooltipData.x,
            top: tooltipData.y,
            maxWidth: '300px'
          }}
        >
          <img 
            src={tooltipData.imageUrl} 
            alt="Product Preview" 
            className="img-fluid"
            style={{ maxHeight: '200px', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Display Controls */}
      <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
        <div className="d-flex align-items-center">
          <label className="form-label me-2 mb-0">Rows per page:</label>
          <select 
            className="form-select form-select-sm" 
            style={{ width: '80px' }}
            onChange={handleRowsChange} 
            value={rowsPerPage}
          >
            {[5, 10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Showing {(currentPage - 1) * rowsPerPage + 1}–
          {Math.min(currentPage * rowsPerPage, rows.length)} of {rows.length} items
        </div>
      </div>

      {/* Pagination */}
      <nav aria-label="Table navigation" className="mt-4">
        <ul className="pagination justify-content-center flex-wrap">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {(() => {
            const pagesToShow = 5;
            let start = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
            let end = start + pagesToShow - 1;

            if (end > totalPages) {
              end = totalPages;
              start = Math.max(end - pagesToShow + 1, 1);
            }

            return [...Array(end - start + 1)].map((_, i) => {
              const page = start + i;
              return (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              );
            });
          })()}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Table;
