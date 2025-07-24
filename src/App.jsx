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


const FormPage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (formData) => {
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
    