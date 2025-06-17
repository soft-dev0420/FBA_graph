import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Table = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              {headers.map((cell, index) => (
                <th key={index} className="text-nowrap align-middle">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="text-nowrap align-middle">
                    {headers[colIndex] === "Product URL" ? (
                      <a href={cell} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-box-arrow-up-right me-1"></i>
                        Visit
                      </a>
                    ) : headers[colIndex] === "Image URL" ? (
                      <img 
                        src={cell} 
                        alt="Product" 
                        className="img-thumbnail" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                      />
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
