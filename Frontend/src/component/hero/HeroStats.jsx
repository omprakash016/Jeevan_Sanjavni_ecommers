import "./HeroStats.css";

import {
  Users,
  Smile,
  Leaf,
} from "lucide-react";

import Container from "../ui/Container";

const HeroStats = () => {
  return (
    <div className="hero-stats">
      <Container>

        <div className="stats-wrapper">

          <div className="stat-card">
            <Users className="stat-icon" />

            <div>
              <h3>4+</h3>
              <p>Experienced Doctors</p>
            </div>
          </div>

          <div className="stat-card">
            <Smile className="stat-icon" />

            <div>
              <h3>1000+</h3>
              <p>Happy Patients</p>
            </div>
          </div>

          <div className="stat-card">
            <Leaf className="stat-icon" />

            <div>
              <h3>100%</h3>
              <p>Natural Care</p>
            </div>
          </div>

        </div>

      </Container>
    </div>
  );
};

export default HeroStats;