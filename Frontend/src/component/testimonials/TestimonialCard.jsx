import { Star } from "lucide-react";

const TestimonialCard = ({ name, location, rating, review }) => {
  return (
    <div className="testimonial-card">
      <div className="rating">
        {[...Array(rating)].map((_, index) => (
          <Star
            key={index}
            size={18}
            fill="#F4B400"
            color="#F4B400"
          />
        ))}
      </div>

      <p className="review">"{review}"</p>

      <div className="testimonial-user">
        <h4>{name}</h4>
        <span>{location}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;