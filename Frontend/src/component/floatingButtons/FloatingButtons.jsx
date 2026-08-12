import "./FloatingButtons.css";

import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const FloatingButtons = () => {
  return (
    <div className="floating-buttons">

      {/* WhatsApp */}

      <a
        href="https://wa.me/919307363011"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>

      {/* Call */}

      <a
        href="tel:+919307363011"
        className="floating-call-btn"
        aria-label="Call Clinic"
      >
        <Phone size={24} />
      </a>

    </div>
  );
};

export default FloatingButtons;