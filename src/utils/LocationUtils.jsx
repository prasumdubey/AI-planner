const API = import.meta.env.VITE_API_URL;


export const getCityName = async () => {
  try {
    if ("geolocation" in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            console.log(" Using navigator.geolocation");
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const res = await fetch(`${API}/api/reverse-geocode?lat=${lat}&lon=${lon}`);
            const data = await res.json();

            // const city ={
            //   city: data.display_name || "",
            // }
            //   // data.address?.city ||
            //   // data.address?.town ||
            //   // data.address?.state ||
            //   // data.address?.county ||
            //   // "";
            //  console.log(" City from navigator:", city);

            // resolve(city);
            const location = data.display_name || "";

            console.log("Location:", location);
            resolve(location);
          },
          async (error) => {
            console.warn(" Geolocation error:", error.message);
            console.log(" Falling back to IP-based location");
            const res = await fetch("https://ip-api.com/json");
            const data = await res.json();

            const location = `${data.city}, ${data.regionName}, ${data.country}`;
            console.log(" Location from IP:", location);

            resolve(location);
            //  console.log(" City from IP:", data.city);
            // resolve(data.city);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,           
            maximumAge: 0             
          }
        );
      });
    } else {
      const res = await fetch("https://ip-api.com/json");
      const data = await res.json();
      const location = `${data.city}, ${data.regionName}, ${data.country}`;
      console.log(" Location from IP (no navigator):", location);

      return location || "Delhi, India";
      //  console.log("🌆 City from IP:", data.city);
      // return data.city || "Delhi";
    }
  } catch (err) {
    console.warn("Location fetch failed");
    return "";
  }
};



