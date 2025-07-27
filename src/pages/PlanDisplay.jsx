import React, { useState } from "react";
import Card from "../components/Card";
import "./PlanDisplay.css";
import resultImage from "../assets/result.svg";
import { useLocation ,useNavigate } from "react-router-dom";




const PlanDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const realPlans = location.state?.plan || []; 

  console.log("Received plans:", realPlans);


  const [currentIndex, setCurrentIndex] = useState(0);

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + realPlans.length) % realPlans.length);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % realPlans.length);
  };

  if (!realPlans.length) {
    return (
      <div className="plan-display-wrapper">
        <h1>No Plan Available</h1>
        <button className="plan-another-btn" onClick={() => navigate("/form")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="plan-display-wrapper">
      <h1>Your Personalized Plan</h1>
      <div className="carousel-wrapper">
        {/* 🔄 Carousel */}
        <div className="carousel">
          <button className="nav-button left" onClick={prevCard}>❮</button>
          <div className="cards-container">
            {realPlans.map((plan, idx) => {
              const position =
                idx === currentIndex
                  ? "active"
                  : idx === (currentIndex + 1) % realPlans.length
                  ? "right"
                  : idx === (currentIndex - 1 + realPlans.length) % realPlans.length
                  ? "left"
                  : "hidden";
              return (
                <div key={idx} className={`card-wrapper ${position}`}>
                  <Card {...plan} />
                </div>
              );
            })}
          </div>
          <button className="nav-button right" onClick={nextCard}>❯</button>
        </div>

        {/* 🖼 Right side image */}
      <img src={resultImage} alt="final Result" className="result-image" />
      </div>

      {/* ✅ Plan Another Button */}
      <div className="plan-another-btn-wrapper">
        <button className="plan-another-btn" onClick={() => navigate("/form")}>
          Plan Another
        </button>
      </div>
    </div>
  );
};

export default PlanDisplay;
