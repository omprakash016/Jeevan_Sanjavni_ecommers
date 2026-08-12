import "./Testimonials.css";

import Badge from "../ui/Badge";
import Heading from "../ui/Heading";
import Container from "../ui/Container";

import testimonials from "../../data/testimonials";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  return (
    <section className="testimonials">
      <Container>
        <div className="testimonial-header">
          <Badge text="Testimonials" />

          <Heading
            title="What Our Patients Say"
            subtitle="Real feedback from patients who trusted Jeevan Sanjivani for their healthcare."
          />
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;