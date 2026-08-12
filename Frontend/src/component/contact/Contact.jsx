import "./Contact.css";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import Heading from "../ui/Heading";

import {
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

const Contact = () => {
  return (
    <section className="contact" id="contact">

      <Container>

        <div className="contact-header">
          <Badge text="Contact Us" />

          <Heading
            title="We're Here to Help You"
            subtitle="Feel free to contact us for appointments or any health-related queries."
          />
        </div>

        <div className="contact-wrapper">

          {/* Left */}

          <div className="contact-info">

            <div className="contact-card">
              <Phone size={28} />

              <div>
                <h3>Phone</h3>
                <p>+91 9307363011</p>
              </div>
            </div>

            <div className="contact-card">
              <MapPin size={28} />

              <div>
                <h3>Address</h3>
                <p>Dhruv Nagar, Nashik</p>
              </div>
            </div>

            <div className="contact-card">
              <Clock size={28} />

              <div>
                <h3>Working Hours</h3>
                <p>Monday - Saturday</p>
                <p>10:00 AM - 8:00 PM</p>
              </div>
            </div>

          </div>

          {/* Right */}

          <div className="map-container">

            <iframe
              title="Clinic Location"
              src="https://maps.google.com/maps?q=Dhruv%20Nagar%20Nashik&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            />

          </div>

        </div>

      </Container>

    </section>
  );
};

export default Contact;