const express=require('express');
const cors=require('cors');
const axios=require('axios');
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());

const FOURSQUARE_API_KEY = process.env.FOURSQUARE;
const port= 5000;


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

     
// app.post("/api/places", async (req, res) => {
//   const { lat, lon, mood, radius } = req.body;

//   console.log(" Request received:", { lat, lon, mood, radius });

//   // Mood-based query mapping
//   const moodQueryMap = {
//     chill: "park",
//     hungry: "restaurant",
//     fun: "entertainment",
//     romantic: "cafe",
//     sporty: "gym",
//   };

//   const query = moodQueryMap[mood.toLowerCase()] || "restaurant";

//   try {
//     const response = await axios.get("https://api.foursquare.com/v3/places/search", {
//       headers: {
//         Authorization: FOURSQUARE_API_KEY,
//       },
//       params: {
//         ll: `${lat},${lon}`,
//         radius: radius * 1000, // km to meters
//         query: query,
//         limit: 5,
//       },
//     });

//     console.log(" Foursquare response received:", response.data.results);

//     const places = response.data.results.map((place) => ({
//       name: place.name,
//       address: place.location?.formatted_address || "",
//       category: place.categories?.[0]?.name || "",
//       rating: place.rating || "N/A", // sometimes rating isn't available
//     }));

//     res.json(places);
//   } catch (err) {
//     console.error(" Foursquare API error:", err.message);
//     res.status(500).json({ error: "Failed to fetch places" });
//   }
// });


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})