import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="app-footer">
      <Container>
        <div className="d-flex justify-content-between align-items-center py-3">
          <div className="text-light">
            © 2025 FBA Graph. All rights reserved.
          </div>
          <div className="d-flex gap-3">
            <a className="text-light text-decoration-none">
              <i className="bi bi-github"></i>
            </a>
            <a className="text-light text-decoration-none">
              <i className="bi bi-linkedin"></i>
            </a>
            <a className="text-light text-decoration-none">
              <i className="bi bi-envelope"></i>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
export default Footer;