import "./WhyChoose.css";

import Badge from "../ui/Badge";
import Heading from "../ui/Heading";
import Container from "../ui/Container";

import WhyCard from "./WhyCard";
import whyChoose from "../../data/WhyChoose"

const WhyChoose = () => {
  return (
    <section className="why-choose">
      <Container>
        <div className="why-header">
          <Badge text="Why Choose Us" />

          <Heading
            title="Why Patients Trust Jeevan Sanjivani"
            subtitle="We combine experienced doctors, natural homeopathic treatment, and personalized care to provide the best healthcare experience."
          />
        </div>

        <div className="why-grid">
          {whyChoose.map((item) => (
            <WhyCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyChoose;