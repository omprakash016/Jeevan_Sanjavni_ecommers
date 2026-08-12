import "./Badge.css";

const Badge = ({ text }) => {
  return (
    <span className="badge">
      {text}
    </span>
  );
};

export default Badge;