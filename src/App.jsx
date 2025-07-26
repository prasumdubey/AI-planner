import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
// import InputForm from "./components/InputForm";
import InputForm from "./pages/InputForm";
import FirstPage from "./pages/FirstPage";
import Navbar from "./components/Navbar";
import PlanDisplay from "./pages/PlanDisplay"; 

// function App() {
//   const handleFormSubmit = async (formData) => {
//     try{
//       const res=await fetch("http://localhost:5000/plan", {
//         method:"POST",
//         headers:{"Content-Type": "application/json"},
//         body: JSON.stringify(formData),
//     });
//     const data=await res.json();
//     console.log("Response from server:", data);
//     } catch (error) {
//       console.log("Error sending ddata to server:", error);
//   }
    
//   };

//   return (
//     <div className="App">
//       <InputForm onSubmit={handleFormSubmit} />
//     </div>
//   );
// }
// locationUtils.js
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

const geocodeCityToLatLng = async (city) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } else {
    throw new Error("City not found");
  }
};

const FormPage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try{
      // const userLocation = await getUserLocation();
      const userLocation=await geocodeCityToLatLng(formData.location);
      const resp1=await fetch("http://localhost:5000/api/places", {
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
    }
     catch (error) {
      console.error("Error submitting form:", error.message); 
    }
    console.log("Form Data:", formData); 
    navigate("/plan"); 
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
    