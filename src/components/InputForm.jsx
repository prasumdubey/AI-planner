// src/components/InputForm.jsx
import  { useEffect,useState } from "react";
import "./InputForm.css";
import { getCityName } from "../utils/LocationUtils";

const InputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    mood: "chill",
    budget: 500,
    radius: 2,
    location: "",
  });

useEffect(() => {
    const fetchCity = async () => {
      const city = await getCityName();
      setFormData((prev) => ({ ...prev, location: city }));
    };
    fetchCity();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Plan Your Day</h2>

      <label>
        Mood:
        <select name="mood" value={formData.mood} onChange={handleChange}>
          <option value="chill">Chill</option>
          <option value="foodie">Foodie</option>
          <option value="explore">Explore</option>
        </select>
      </label>

      <label>
        Budget (₹):
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
        />
      </label>

      <label>
        Location (optional):
        <input
          type="text"
          name="location"
          placeholder="Enter city"
          value={formData.location}
          onChange={handleChange}
        />
      </label>

      <label>
        Radius (km):
        <select name="radius" value={formData.radius} onChange={handleChange}>
          <option value={1}>1 km</option>
          <option value={2}>2 km</option>
          <option value={5}>5 km</option>
        </select>
      </label>

      <button type="submit">Generate Plan</button>
    </form>
  );
};

export default InputForm;
