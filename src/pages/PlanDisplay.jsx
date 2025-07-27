import React, { useState } from "react";
import Card from "../components/Card";
import "./PlanDisplay.css";
import resultImage from "../assets/result.svg";
import { useLocation ,useNavigate } from "react-router-dom";


// // const samplePlans = [
// //   {
// //     activity: "Visit India Gate",
// //     description: "A historical war memorial offering peaceful surroundings and local street food.",
// //     location: "India Gate, New Delhi",
// //     budget: 300,
// //     duration: "2 hours",
// //     rating: 4.5,
// //     suggestion: "Ideal for an evening walk and patriotic vibe.",
// //     priority: 1,
// //   },
// //   {
// //     activity: "Explore Lodhi Garden",
// //     description: "A lush green garden with Mughal tombs, perfect for nature lovers.",
// //     location: "Lodhi Garden, Delhi",
// //     budget: 100,
// //     duration: "1.5 hours",
// //     rating: 4.2,
// //     suggestion: "Great for photography and peaceful moments.",
// //     priority: 2,
// //   },
// //   {
// //     activity: "Shopping at Sarojini",
// //     description: "Budget-friendly fashion street market with tons of options.",
// //     location: "Sarojini Nagar Market",
// //     budget: 500,
// //     duration: "3 hours",
// //     rating: 4.0,
// //     suggestion: "Perfect for budget shoppers and trend lovers.",
// //     priority: 3,
// //   },
// //   {
// //     activity: "Cafe Hop at Champa Gali",
// //     description: "Trendy cafes with artistic vibes and food.",
// //     location: "Champa Gali, Saket",
// //     budget: 700,
// //     duration: "2.5 hours",
// //     rating: 4.3,
// //     suggestion: "Best for chilling with friends or remote work.",
// //     priority: 4,
// //   },
// // ];

// const PlanDisplay = () => {
//   const navigate = useNavigate();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const prevCard = () => {
//     setCurrentIndex((prev) => (prev - 1 + samplePlans.length) % samplePlans.length);
//   };

//   const nextCard = () => {
//     setCurrentIndex((prev) => (prev + 1) % samplePlans.length);
//   };

//   return (
//     <div className="plan-display-wrapper">
//       <h1>Your Personalized Plan</h1>
//       <div className="carousel-wrapper">
//   {/* 🔄 Carousel left side */}
//       <div className="carousel">
//         <button className="nav-button left" onClick={prevCard}>❮</button>
//         <div className="cards-container">
//           {samplePlans.map((plan, idx) => {
//             const position =
//               idx === currentIndex
//                 ? "active"
//                 : idx === (currentIndex + 1) % samplePlans.length
//                 ? "right"
//                 : idx === (currentIndex - 1 + samplePlans.length) % samplePlans.length
//                 ? "left"
//                 : "hidden";
//             return (
//               <div key={idx} className={`card-wrapper ${position}`}>
//                 <Card {...plan} />
//               </div>
//             );
//           })}
//         </div>
//         <button className="nav-button right" onClick={nextCard}>❯</button>
//       </div>

//       {/* 🖼 Right side image */}
//       <img src={resultImage} alt="final Result" className="result-image" />
//     </div>


//       {/* ✅ Plan Another Button */}
//       <div className="plan-another-btn-wrapper">
//         <button className="plan-another-btn" onClick={() => navigate("/form")}>
//           Plan Another
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PlanDisplay;



const PlanDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const realPlans = location.state?.plan || []; // ⬅️ assuming `plans` is key in data2

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
