import "./Footer.css";

import { MapPin, Phone } from "lucide-react";

import Container from "../ui/Container";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>

        <div className="footer-content">

          <div className="footer-logo">
            <h2>
              Jeevan <span>Sanjivani</span>
            </h2>

            <p>
              Natural & Personalized Homeopathic Care
            </p>
          </div>

          <div className="footer-info">

            <div className="footer-item">
              <Phone size={18} />
              <span>+91 9307363011</span>
            </div>

            <div className="footer-item">
              <MapPin size={18} />
              <span>Dhruv Nagar, Nashik</span>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Jeevan Sanjivani. All Rights Reserved.
        </div>

      </Container>
    </footer>
  );
};

export default Footer;