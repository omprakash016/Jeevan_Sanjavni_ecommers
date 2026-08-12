/*import Button from "../component/ui/Button";
import Container from "../component/ui/Container";
import SectionTitle from "../component/ui/SectionTitle";

const Home = () => {
  return (
    <Container>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SectionTitle
          title="Jeevan Sanjivani"
          subtitle="Healthcare at your fingertips"
        />

        <Button>Get Started</Button>
      </div>
    </Container>
  );
};

export default Home;*/

import Doctors from "../component/doctors/Doctor";
import Hero from "../component/hero/Hero";
import About from "../component/about/About";
import ProductVideo from "../component/productVideo/ProductVideo";
import WhyChoose from "../component/whyChoose/WhyChoose";
import Services from "../component/services/Services";
import Testimonials from "../component/testimonials/Testimonials"; 
import Contact from "../component/contact/Contact";
const Home = () => {
  return (
   <>
  <Hero />
  <About />
  <ProductVideo />
  <WhyChoose />
  <Doctors />
  <Services />
  <Testimonials />
  <Contact />
</>
  );
};

export default Home;