const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this line to parse JSON bodies

let eventsData = require("./data.json");

// ROUTES
app.get('/events', (req, res) => {
    return res.json({ events: eventsData });
});

app.get("/events/find", async (req, res) => {
    const { date, latitude, longitude, page } = req.query;

    if (!date || !latitude || !longitude || !page) {
        return res.status(400).json({ error: "Please provide a date, latitude, longitude, and page in the query parameters." });
    }

    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date format. Please provide the date in yyyy-mm-dd format.");
        }

        const filteredEvents = eventsData.filter(event => new Date(event.date) >= parsedDate);
        filteredEvents.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
            } else {
                const distanceA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
                const distanceB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
                return distanceA - distanceB;
            }
        });

        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

        const eventsDataWithWeather = await Promise.all(paginatedEvents.map(async event => {
            try {
                const weatherData = await fetchWeather(event.city_name, event.date);
                const distanceData = calculateDistance(latitude, longitude, event.latitude, event.longitude);

                return {
                    event_name: event.event_name,
                    city_name: event.city_name,
                    date: event.date,
                    weather: weatherData,
                    distance_km: distanceData
                };
            } catch (error) {
                console.error("Error fetching data for event:", event, error.message);
                return null;
            }
        }));

        const validEvents = eventsDataWithWeather.filter(event => event !== null);
        
        // Pagination metadata
        const totalEvents = filteredEvents.length;
        const totalPages = Math.ceil(totalEvents / pageSize);

        return res.json({ 
            events: validEvents,
            page: parseInt(page),
            pageSize: pageSize,
            totalEvents: totalEvents,
            totalPages: totalPages
        });
    } catch (error) {
        console.error("Error processing request:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
});

app.post("/events/add", async (req, res) => {
    try {
        const { event_name, city_name, date, time, latitude, longitude } = req.body;

        if (!event_name || !city_name || !date || !time || !latitude || !longitude) {
            return res.status(400).json({ error: "Please provide all required event details." });
        }

        // Add new event to the eventsData array
        eventsData.push({
            event_name,
            city_name,
            date,
            time,
            latitude,
            longitude
        });

        // Write updated eventsData back to the JSON file
        fs.writeFileSync("./data.json", JSON.stringify(eventsData, null, 2));

        return res.status(201).json({ message: "Event added successfully" });
    } catch (error) {
        console.error("Error adding event:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula for calculating distance between two coordinates
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

async function fetchWeather(cityName, date) {
    try {
        const response = await axios.get("https://gg-backend-assignment.azurewebsites.net/api/Weather", {
            params: {
                code: "KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==",
                city: cityName,
                date: date
            }
        });
        return response.data.weather;
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        throw new Error("Failed to fetch weather data.");
    }
}

app.listen(PORT, () => console.log(`Server Started at Port:${PORT}`));
