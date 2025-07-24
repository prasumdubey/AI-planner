import { useNavigate } from "react-router-dom";
import illustration from "../assets/reading.svg";
import "./FirstPage.css";

const FirstPage = () => {
  const navigate = useNavigate();

  return (
    <div className="first-page">

      <section className="hero">
        <div className="hero-text">
          <h2>Plan Your Day, Your Way!</h2>
          <p>
            <strong>Discover personalized plans based on your mood, budget, and time. Whether alone or with friends—Planless helps you make every hour count.</strong>
            <br></br>🎯 Personalized Plans 💰 Budget-Friendly Fun 🤝 Solo or Social 📍 Local & Relevant 
          </p>
          <button className="cta-button" onClick={() => navigate("/form")}>Plan Your Day</button>
        </div>
        <div className="hero-image">
          <img src={illustration} alt="Girl Reading" />
        </div>
      </section>
    </div>
  );
};

export default FirstPage;
