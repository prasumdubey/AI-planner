import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    let res=null;
    setLoading(true);
    try{
      // const userLocation=await geocodeCityToLatLng(formData.location);
       let userLocation;
    try {
      userLocation = await geocodeCityToLatLng(formData.location);
    } catch (geoErr) {
      toast.error("Failed to find the location you entered. Please enter a valid city name.");
      return;
    }
      // const resp1=await fetch(`${API}/api/places`, {
      //   method:"POST",
      //   headers:{"Content-Type": "application/json"},
      //   body: JSON.stringify({lat: userLocation.lat,
      //                         lon: userLocation.lon,
      //                         radius: formData.radius,
      //                         mood: formData.mood,}),
      // });

    let data1;
    try {
      const resp1 = await fetch(`${API}/api/places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: userLocation.lat,
          lon: userLocation.lon,
          radius: formData.radius,
          mood: formData.mood,
        }),
      });

      if(!resp1.ok)  throw new Error("Failed to fetch data from places api");

      data1 = await resp1.json();
      console.log("API Response:", data1);

      if (!data1 || data1.length === 0) {
        toast.warn("No nearby places found for your location and mood.");
        return;
      }

    } catch (placeErr) {
      toast.error("Failed to fetch nearby places. Please try again later.");
      return;
    }

  //     const resp2=await fetch(`${API}/api/plan-ai`,{
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({mood: formData.mood,
  //                             location: formData.location,
  //                             budget: formData.budget,
  //                             places: data1,
  // }),
  //     });
  //     if(!resp2.ok) throw new Error("Failed to fetch data from AI planner API");
  //     const data2=await resp2.json(); 
  //     res=data2;
  //     console.log("AI Planner Response:", data2);

   try {
      const resp2 = await fetch(`${API}/api/plan-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: formData.mood,
          location: formData.location,
          budget: formData.budget,
          places: data1,
        }),
      });

      if (!resp2.ok) throw new Error("AI Planner API response not OK");

      const data2 = await resp2.json();
      res = data2;
      console.log("AI Planner Response:", data2);

    } catch (aiErr) {
      toast.error("Failed to generate a plan. Please try again.");
      return;
    }
    }
    catch (error) {
      console.error("Error submitting form:", error.message);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); 
    }

  
    if (res && res.plan) {
      navigate("/plan", { state: { plan: res.plan } });
    } else {
      toast.error("Sorry! Couldn't generate a plan. Please try again.");
    }
  };

  return <InputForm onSubmit={handleFormSubmit} loading={loading}/>;
};

const App = () => {

  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
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
    