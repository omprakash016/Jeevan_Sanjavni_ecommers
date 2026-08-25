import "./DoctorCard.css";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <img
        src={doctor.image}
        alt={doctor.name}
        className="doctor-image"
      />

      <h3>{doctor.name}</h3>

      <p className="qualification">
        {doctor.qualification}
      </p>
       {/* Call Now Button */}
      <a
        href={`tel:${doctor.contact.replace(/\s+/g, "")}`}
        className="call-doctor-btn"
      >
        📞 Call Now
      </a>
    </div>
  );
};

export default DoctorCard;