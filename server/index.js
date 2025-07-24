const express=require('express');
const cors=require('cors');
const axios=require('axios');
const { GoogleGenAI } =require('@google/genai');

require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

const port= 5000;

const placeKey = process.env.GOOGLE_PLACES_API_KEY;

app.get('/',(req,res)=>{
    res.send('AI Planner Server is running');
})


app.post('/plan',(req,res)=>{
    const {mood ,budget,radius,location}=req.body ;
    console.log("Form data recieved:",req.body);
    
    res.json({message: "Plan received successfully", data:req.body});
})

app.get("/api/reverse-geocode", async (req, res) => {
    const {lat, lon} =req.query;
    try{
         const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat,
        lon,
        format: "json",
      },
     
         });
            res.json(response.data);
        }
    catch (err) {
    console.error("Reverse geocode failed:", err.message);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

     
app.post("/api/places", async (req, res) => {
  const { lat, lon, mood, radius } = req.body;

  console.log("Request received:", { lat, lon, mood, radius });

  // Mood-to-place type mapping (Google Places types)
  const moodQueryMap = {
    chill: "park",
    hungry: "restaurant",
    fun: "amusement_park",
    romantic: "cafe",
    sporty: "gym",
  };

  const type = moodQueryMap[mood?.toLowerCase()] || "restaurant";

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lon}`,
          radius: radius * 1000, // convert km to meters
          type: type,
          key: placeKey,
        },
      }
    );

    const places = response.data.results.map((place) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || "N/A",
      types: place.types,
      location: place.geometry.location,
    }));

    res.json(places);
  } catch (err) {
    console.error("Google Places API error:", err.message);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});



const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/plan-ai", async (req, res) => {
  const { mood, location, budget, places = [], movies = [] } = req.body;

  const prompt = `
You are an AI day planner.
Location: ${location}
Mood: ${mood}
Budget: ₹${budget}
Nearby places: ${places.map(p => `${p.name} (${p.category})`).join(", ")}
Movies: ${movies.map(m => `${m.title} (Rating: ${m.rating})`).join(", ")}

Suggest a fun plan using one place and one movie within budget.
`;

  try {
    // 👇 Use getModel(), not getGenerativeModel()
    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: prompt,
    });

    const planText = response.text;

    return res.json({ plan: planText });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});




app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})