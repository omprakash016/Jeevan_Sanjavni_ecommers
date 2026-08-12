import { ArrowRight } from "lucide-react";

const ServiceCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="service-card">

      <div className="service-icon">
        <Icon size={34} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button className="service-btn">
        Learn More
        <ArrowRight size={18} />
      </button>

    </div>
  );
};

export default ServiceCard;