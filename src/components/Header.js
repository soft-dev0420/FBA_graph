import { Container, Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  return (
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
  )
}

export default Header;