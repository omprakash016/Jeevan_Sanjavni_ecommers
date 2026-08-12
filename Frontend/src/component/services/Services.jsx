import "./Services.css";

import Badge from "../ui/Badge";
import Heading from "../ui/Heading";
import Container from "../ui/Container";

import services from "../../data/services";
import ServiceCard from "./ServicesCard";

const Services = () => {
  return (
    <section className="services">

      <Container>

        <div className="services-header">

          <Badge text="Our Services" />

          <Heading
            title="Comprehensive Homeopathic Healthcare"
            subtitle="We provide personalized homeopathic treatment for people of all ages with a focus on natural healing and long-term wellness."
          />

        </div>

        <div className="services-grid">

          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}

        </div>

      </Container>
    </section>
  );
};

export default Services;