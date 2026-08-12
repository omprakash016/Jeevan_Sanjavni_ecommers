import "./About.css";
import { motion } from "framer-motion";
import { fadeUp } from "../animations/motion";

import { CheckCircle } from "lucide-react";

import Badge from "../ui/Badge";
import Heading from "../ui/Heading";
import Container from "../ui/Container";

import about from "../../data/about";
import aboutImage from "../../assets/about/about-clinic.png";

const About = () => {
  return (
    <section className="about">
      <Container>
        <div className="about-wrapper">
          {/* Left */}
          <motion.div
            className="about-image"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <img
              src={aboutImage}
              alt="Jeevan Sanjivani Homeopathy Clinic"
            />
          </motion.div>

          {/* Right */}
          <motion.div
            className="about-content"
             variants={fadeUp}
              initial="hidden"
             whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
            <Badge text={about.badge} />

            <Heading
              title={about.title}
              subtitle={about.subtitle}
            />

            <p className="about-description">
              {about.description}
            </p>

            <div className="about-features">
              {about.features.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <CheckCircle size={20} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default About;