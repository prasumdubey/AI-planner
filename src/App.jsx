import "./App.css";
import InputForm from "./components/InputForm";

function App() {
  const handleFormSubmit = async (formData) => {
    try{
      const res=await fetch("http://localhost:5000/plan", {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(formData),
    });
    const data=await res.json();
    console.log("Response from server:", data);
    } catch (error) {
      console.log("Error sending ddata to server:", error);
  }
    
  };

  return (
    <div className="App">
      <InputForm onSubmit={handleFormSubmit} />
    </div>
  );
}

export default App;
    