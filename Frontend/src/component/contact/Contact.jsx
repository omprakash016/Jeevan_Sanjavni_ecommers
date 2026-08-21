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
  const instagramUrl =
    "https://www.instagram.com/jeevan_sanjiviniii_06?igsh=MXdkeng4azMxcTNieQ==";

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

          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="contact-info">

            {/* PHONE */}

            <div className="contact-card">

              <Phone size={28} />

              <div>
                <h3>Phone</h3>
                <p>+91 9307363011</p>
              </div>

            </div>


            {/* ADDRESS */}

            <div className="contact-card">

              <MapPin size={28} />

              <div>
                <h3>Address</h3>
                <p>Dhruv Nagar, Nashik</p>
              </div>

            </div>


            {/* WORKING HOURS */}

            <div className="contact-card">

              <Clock size={28} />

              <div>
                <h3>Working Hours</h3>

                <p>Monday - Saturday</p>

                <p>
                  10:00 AM - 8:00 PM
                </p>

              </div>

            </div>


            {/* INSTAGRAM */}

            <a
                href="https://www.instagram.com/jeevan_sanjiviniii_06?igsh=MXdkeng4azMxcTNieQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card instagram-card"
              >
                <div className="instagram-icon">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <div>
                  <h3>Instagram</h3>

                  <p>
                    @jeevan_sanjiviniii_06
                  </p>
                </div>
              </a>

          </div>


          {/* =========================
              RIGHT SIDE - MAP
          ========================= */}

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