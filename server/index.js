const express=require('express');
const cors=require('cors');
const axios=require('axios');
const { GoogleGenAI } =require('@google/genai');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
  foodie: "restaurant",
  explore: "tourist_attraction",
  romantic: "cafe",
  adventurous: "amusement_park",
  cultural: "museum",
  nature: "natural_feature", // fallback, not directly supported
  relaxing: "spa",
  party: "night_club",
  historical: "museum",
  luxury: "shopping_mall",
  budget: "restaurant",
  techy: "electronics_store",
  artistic: "art_gallery",
  photography: "point_of_interest",
  shopping: "shopping_mall",
  religious: "church",
  wildlife: "zoo",
  fitness: "gym",
  coffee: "cafe",
  other: "tourist_attraction"
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
    console.log(" Places fetched:", places.length);
    res.json(places);
  } catch (err) {
    console.error("Google Places API error:", err.message);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});



// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY );

app.post("/api/plan-ai", async (req, res) => {
  const { mood, location, budget, places = [], movies = [] } = req.body;

  const prompt = `
You are an intelligent day planner AI.

Location: ${location}
Mood: ${mood}
Budget: ₹${budget}

Nearby Places:
${places.map((p, i) => `${i + 1}. ${p.name} (${p.types?.[0] || "general"}), Rating: ${p.rating || "N/A"}`).join("\n")}

Movies Available:
${movies.map((m, i) => `${i + 1}. ${m.title} (Rating: ${m.rating})`).join("\n")}

Based on the user's mood and budget, choose one place and one movie, and generate a JSON object in the exact format below:

{
  "activity": "string",
  "description": "string",
  "location": "string",
  "budget": number,
  "duration": "string",
  "rating": number,
  "suggestion": "string",
  "priority": number
}

Make sure to fill values sensibly. Return only the JSON.
`;

try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to extract a JSON object from Gemini's text
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("No valid JSON response from Gemini");

    const plan = JSON.parse(jsonMatch[0]);
    res.json({ plan });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})