import "./Hero.css";
import hero from "../../data/hero";

import { Phone, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import Heading from "../ui/Heading";

import heroDoctor from "../../assets/hero/Doctor.png";
import HeroStats from "./HeroStats";
import { motion } from "framer-motion";

import {
  fadeLeft,
  fadeRight,
} from "../animations/motion";


const Hero = () => {
   const navigate = useNavigate();
   const handleProductClick = () => {
  navigate("/products");
  };
  return (
    <section className="hero">

      <Container>

        <div className="hero-wrapper">

          {/* LEFT */}

          <motion.div
          className="hero-left"
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          >

            <Badge text="🌿 Trusted Homeopathic Clinic" />

            <Heading
                title={hero.title}
                subtitle={hero.subtitle}
            />

            <ul className="hero-features">

              <li>
                <CheckCircle size={20}/>
                Experienced B.H.M.S Doctors
              </li>

              <li>
                <CheckCircle size={20}/>
                Personalized Treatment
              </li>

              <li>
                <CheckCircle size={20}/>
                Trusted Family Healthcare
              </li>

            </ul>

            <div className="hero-buttons">

            
            {/* PRODUCT BUTTON */}

            <button
              type="button"
              className="video-btn"
              onClick={handleProductClick}
            >
              View Our Products
              <span>+</span>
            </button>

              <a
              href="tel:+919307363011"
                className="hero-call-btn"
            >
              <Phone size={18} />
                Call Now
                </a>  

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
          className="hero-right"
          variants={fadeRight}
          initial="hidden"
           whileInView="visible"
            viewport={{ once: true }}
      >

            <img
              src={heroDoctor}
              alt="Homeopathy Doctor"
            />

          </motion.div>

        </div>

      </Container>

      <HeroStats/>

    </section>
  );
};

export default Hero;