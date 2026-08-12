import "./Heading.css";

const Heading = ({ title, subtitle, align = "left" }) => {
  return (
    <div className={`heading ${align}`}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
};

export default Heading;