import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import InputForm from "./pages/InputForm";
import FirstPage from "./pages/FirstPage";
import Navbar from "./components/Navbar";
import PlanDisplay from "./pages/PlanDisplay"; 
const API = import.meta.env.VITE_API_URL;


const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          reject(err);
        }
      );
    }
  });
};

// const geocodeCityToLatLng = async (city) => {
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
//   const res = await fetch(url);
//   const data = await res.json();
  
//   if (data.length > 0) {
//     return {
//       lat: parseFloat(data[0].lat),
//       lon: parseFloat(data[0].lon),
//     };
//   } else {
//     throw new Error("City not found");
//   }
// };

const geocodeCityToLatLng = async (city) => {
  const url = `${API}/api/geocode?city=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) throw new Error("City not found");

  return {
    lat: data.lat,
    lon: data.lon,
  };
};


const FormPage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    let res=null;
    try{
      const userLocation=await geocodeCityToLatLng(formData.location);
      const resp1=await fetch(`${API}/api/places`, {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({lat: userLocation.lat,
                              lon: userLocation.lon,
                              radius: formData.radius,
                              mood: formData.mood,}),
      });
      if(!resp1.ok)  throw new Error("Failed to fetch data from places api");
      const data1=await resp1.json();

      console.log("API Response:", data1);

      const resp2=await fetch(`${API}/api/plan-ai`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({mood: formData.mood,
                              location: formData.location,
                              budget: formData.budget,
                              places: data1,
  }),
      });
      if(!resp2.ok) throw new Error("Failed to fetch data from AI planner API");
      const data2=await resp2.json(); 
      res=data2;
      console.log("AI Planner Response:", data2);
    }
     catch (error) {
      console.error("Error submitting form:", error.message); 
    }
    console.log("Form Data:", formData); 
    if (res && res.plan) {
      navigate("/plan", { state: { plan: res.plan } });
    } else {
      alert("Sorry! Couldn't generate a plan. Please try again.");
    }
  };

  return <InputForm onSubmit={handleFormSubmit} />;
};

const App = () => {

  return (
    <Router>
      <Navbar />
      <div className="app-body">
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/plan" element={<PlanDisplay />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
    