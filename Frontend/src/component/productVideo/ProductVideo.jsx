import "./ProductVideo.css";

import Badge from "../ui/Badge";
import Heading from "../ui/Heading";
import Container from "../ui/Container";

import video from "../../assets/videos/product-video.mp4";

import { useNavigate } from "react-router-dom";

const ProductVideo = () => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate("/products");
  };

  return (
    <section className="product-video">
      <Container>

        {/* =========================
            VIDEO HEADER
        ========================= */}

        <div className="video-header">

          <Badge text="Our Product" />

          <Heading
            title="See How Jeevan Sanjivani Helps You"
            subtitle="Watch our short video to learn about our treatments, our approach, and how we care for every patient with safe and natural homeopathic solutions."
          />

        </div>


        {/* =========================
            VIDEO SECTION
        ========================= */}

        <div className="video-section">

          {/* VIDEO */}

          <div className="video-wrapper">

            <video
              autoPlay
              loop
              playsInline
              controls
              className="clinic-video"
            > 
              <source
                src={video}
                type="video/mp4"
              />

              Your browser does not support the video tag.

            </video>

          </div>


          {/* CONTENT */}

          <div className="video-content">

            <h3>
              Why Watch This Video?
            </h3>

            <p>
              This is our exclusive product for
              women's period pain. Using this
              product, you can get relief from
              period pain and cramps. It is a
              natural and safe solution for women.
            </p>


            <ul>

              <li>
                ✔ Personalized Treatment Plans
              </li>

              <li>
                ✔ Experienced B.H.M.S Doctors
              </li>

              <li>
                ✔ Safe & Natural Medicines
              </li>

              <li>
                ✔ Family Healthcare
              </li>

            </ul>


            {/* PRODUCT BUTTON */}

            <button
              type="button"
              className="video-btn"
              onClick={handleProductClick}
            >
              View Our Products
              <span>+</span>
            </button>

          </div>

        </div>

      </Container>
    </section>
  );
};

export default ProductVideo;