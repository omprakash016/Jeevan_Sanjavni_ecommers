const WhyCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="why-card">
      <div className="why-icon">
        <Icon size={34} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
};

export default WhyCard;