import "./Doctor.css";

import doctors from "../../data/doctors";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import DoctorCard from "./DoctorCard";

const Doctors = () => {
  return (
    <section className="doctors-section">
      <Container>
        <SectionTitle
          title="Our Doctors"
          subtitle="Meet our experienced B.H.M.S. doctors dedicated to providing safe and personalized homeopathic treatment."
        />

        <>
            <div className="doctors-grid">
              {doctors.slice(0, 3).map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>

            <div className="doctors-grid doctors-grid-bottom">
              {doctors.slice(3).map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </>
      </Container>
    </section>
  );
};

export default Doctors;