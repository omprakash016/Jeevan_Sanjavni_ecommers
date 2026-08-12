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
      <p className="Doctor_contact">
        📞 {doctor.contact}
      </p>
    </div>
  );
};

export default DoctorCard;