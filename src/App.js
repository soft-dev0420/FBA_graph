import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TablePage from './pages/TablePage';
import DetailPage from './pages/DetailPage';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="app-background">
      <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar">
        <Container>
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-graph-up me-2" style={{ fontSize: '1.8rem' }}></i>
              <div className="d-flex flex-column">
                <span className="fw-bold" style={{ fontSize: '1.4rem' }}>FBA Graph</span>
                <span className="text-light" style={{ fontSize: '0.8rem', opacity: 0.8 }}>Amazon FBA Data Analytics</span>
              </div>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/" element={<TablePage />} />
              <Route path="/detail" element={<DetailPage />} />
            </Routes>
          </Router>
        </Provider>
      </main>

      <footer className="app-footer">
        <Container>
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="text-light">
              © 2025 FBA Graph. All rights reserved.
            </div>
            <div className="d-flex gap-3">
              <a href="#" className="text-light text-decoration-none">
                <i className="bi bi-github"></i>
              </a>
              <a href="#" className="text-light text-decoration-none">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="text-light text-decoration-none">
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;