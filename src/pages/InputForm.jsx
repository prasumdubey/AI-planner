import { useEffect, useState } from "react";
import "./InputForm.css";
import { getCityName } from "../utils/LocationUtils";
import loginImage from "../assets/login.svg"; 
import formImage from "../assets/form.svg"; 
import { useNavigate } from "react-router-dom";

const moodOptions = [
  "chill", "foodie", "explore", "romantic", "adventurous", "cultural",
  "nature", "relaxing", "party", "historical", "luxury", "budget",
  "techy", "artistic", "photography", "shopping", "religious",
  "wildlife", "fitness", "coffee", "other"
];

const groupTypes = ["Friends", "Family", "Partner", "Colleagues", "Kids", "Others"];
const timePreferences = ["Morning", "Afternoon", "Evening", "Anytime"];
const durations = ["Half Day", "Full Day", "Custom (in hours)"];

const InputForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mood: "chill",
    customMood: "",
    budget: 500,
    radius: 2,
    location: "",
    isAlone: "yes",
    groupSize: 1,
    groupType: "",
    timePref: "Anytime",
    duration: "Full Day",
    customDuration: ""
  });

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [userTypedLocation, setUserTypedLocation] = useState(false);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const city = await getCityName();
        if (!userTypedLocation && city) {
          setFormData((prev) => ({ ...prev, location: city }));
        }
      } catch (error) {
        console.error("Location detection failed:", error);
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchCity();
  }, [userTypedLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "location") setUserTypedLocation(true);

    setFormData((prev) => ({
      ...prev,
      [name]: ["budget", "radius", "groupSize", "customDuration"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      mood: formData.mood === "other" ? formData.customMood.trim() : formData.mood,
      duration: formData.duration === "Custom (in hours)"
        ? `${formData.customDuration} hours`
        : formData.duration
    };

    delete finalFormData.customMood;
    delete finalFormData.customDuration;

    onSubmit(finalFormData);
  };

  return (
    <div className="input-form-page">
      <div className="form-illustration">
        <img src={loginImage} alt="person planning" />
      </div>
      <form className="input-form-container" onSubmit={handleSubmit}>
        <div className="title-container">
          <img src={formImage} alt="form illustration" className="form-image" />
          <h2> Plan Your Day</h2>
        </div>

        {/* Mood & Custom Mood */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mood">Mood:</label>
            <select id="mood" name="mood" value={formData.mood} onChange={handleChange} required>
              <option value="">-- Select Mood --</option>
              {moodOptions.map((mood) => (
                <option key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {formData.mood === "other" && (
            <div className="form-group">
              <label htmlFor="customMood">Your Mood:</label>
              <input
                id="customMood"
                type="text"
                name="customMood"
                placeholder="Describe your mood"
                value={formData.customMood}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        {/* Budget & Location */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="budget">Budget (₹):</label>
            <input
              id="budget"
              type="number"
              name="budget"
              min="100"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Location {loadingLocation ? "(Detecting...)" : "(Auto/Manual)"}:
            </label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Enter city"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Radius & Going Alone */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="radius">Radius (in KM):</label>
            <input
              id="radius"
              type="number"
              name="radius"
              min="0.1"
              step="0.1"
              value={formData.radius}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isAlone">Are you going alone?</label>
            <select id="isAlone" name="isAlone" value={formData.isAlone} onChange={handleChange}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Group Size & Type (only if not alone) */}
        {formData.isAlone === "no" && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="groupSize">Group Size:</label>
              <input
                id="groupSize"
                type="number"
                name="groupSize"
                min="2"
                value={formData.groupSize}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="groupType">Who are you with?</label>
              <select
                id="groupType"
                name="groupType"
                value={formData.groupType}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Group Type --</option>
                {groupTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Time & Duration */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="timePref">Preferred time to start:</label>
            <select
              id="timePref"
              name="timePref"
              value={formData.timePref}
              onChange={handleChange}
            >
              {timePreferences.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration of plan:</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            >
              {durations.map((dur) => (
                <option key={dur} value={dur}>
                  {dur}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Duration (if selected) */}
        {formData.duration === "Custom (in hours)" && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customDuration">Enter hours:</label>
              <input
                id="customDuration"
                type="number"
                name="customDuration"
                min="1"
                value={formData.customDuration}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-row btn-row">
          <button type="reset" className="reset-btn" style={{ width: "25%" }}>Reset</button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loadingLocation}
            onClick={() => navigate("/plan")}
            style={{ width: "25%" }}
          >
            {loadingLocation ? "Loading..." : "Generate Plan"}
          </button>
        </div>
      </form>

    </div>
  );
};

export default InputForm;
