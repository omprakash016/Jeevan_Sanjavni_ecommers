import "./ProductVideo.css";


import Badge from "../ui/Badge";
import Heading from "../ui/Heading";
import Container from "../ui/Container";

import video from "../../assets/videos/product-video.mp4";

const ProductVideo = () => {
  return (
    <section className="product-video">
      <Container>
<div className="video-header">
  <Badge text="Our Product" />

  <Heading
    title="See How Jeevan Sanjivani Helps You"
    subtitle="Watch our short video to learn about our treatments, our approach, and how we care for every patient with safe and natural homeopathic solutions."
  />
</div>

<div className="video-section">

  <div className="video-wrapper">
    <video controls className="clinic-video">
      <source src={video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

  <div className="video-content">

    <h3>Why Watch This Video?</h3>

    <p>
     This is Video our exclusive product for Women period pain.Using this product you can get relief from period pain and cramps. It is a natural and safe solution for women.
    </p>

    <ul>
      <li>✔ Personalized Treatment Plans</li>
      <li>✔ Experienced B.H.M.S Doctors</li>
      <li>✔ Safe & Natural Medicines</li>
      <li>✔ Family Healthcare</li>
    </ul>

    <button className="video-btn">
      Free Appointment
    </button>

  </div>

</div>


        

      </Container>
    </section>
  );
};

export default ProductVideo;