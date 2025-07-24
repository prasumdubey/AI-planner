import "./Card.css";

const Card = ({
  activity,
  description,
  location,
  budget,
  duration,
  rating,
  suggestion,
  image,
  priority
}) => {
  return (
    <div className="card-component">
      <div className="card-priority">
        {image && <img src={image} alt="priority" className="priority-icon" />}
        <span className="priority-text">Priority: {priority}</span>
      </div>

      <h2 className="activity-title">{activity}</h2>
      <p className="description">{description}</p>

      <div className="card-info">
        <p><strong>📍 Location:</strong> {location}</p>
        <p><strong>💸 Budget:</strong> ₹{budget}</p>
        <p><strong>⏱ Duration:</strong> {duration}</p>
        <p><strong>⭐ Rating:</strong> {rating}/5</p>
      </div>

      <div className="suggestion-box">
        <h4>Why this?</h4>
        <p>{suggestion}</p>
      </div>
    </div>
  );
};

export default Card;
