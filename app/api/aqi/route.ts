import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (lat && lng) {
        try {
            // Fetch real-time US AQI from Open-Meteo (Free, No Key)
            const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi`);
            const data = await res.json();

            const aqi = data.current.us_aqi;
            let status = "Good";
            if (aqi > 50) status = "Moderate";
            if (aqi > 100) status = "Unhealthy for Sensitive Groups";
            if (aqi > 150) status = "Unhealthy";
            if (aqi > 200) status = "Very Unhealthy";
            if (aqi > 300) status = "Hazardous";

            return NextResponse.json([{
                id: 0,
                city: "Your Location",
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                aqi: aqi,
                status: status
            }]);
        } catch (error) {
            console.error("Open-Meteo Fetch Error:", error);
            // Fallback if API fails
            return NextResponse.json([{
                id: 0,
                city: "Your Location (Offline)",
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                aqi: 42,
                status: "Good"
            }]);
        }
    }

    // Default "Global View" if no location provided
    const MOCK_AQI_DATA = [
        { id: 1, city: "New York", lat: 40.7128, lng: -74.0060, aqi: 45, status: "Good" },
        { id: 2, city: "London", lat: 51.5074, lng: -0.1278, aqi: 62, status: "Moderate" },
        { id: 3, city: "Tokyo", lat: 35.6762, lng: 139.6503, aqi: 35, status: "Good" },
        { id: 4, city: "Delhi", lat: 28.6139, lng: 77.2090, aqi: 180, status: "Unhealthy" },
        { id: 5, city: "Beijing", lat: 39.9042, lng: 116.4074, aqi: 155, status: "Unhealthy" },
        { id: 6, city: "Paris", lat: 48.8566, lng: 2.3522, aqi: 58, status: "Moderate" },
        { id: 7, city: "Berlin", lat: 52.5200, lng: 13.4050, aqi: 42, status: "Good" },
        { id: 8, city: "Sydney", lat: -33.8688, lng: 151.2093, aqi: 25, status: "Good" },
        { id: 9, city: "Sao Paulo", lat: -23.5505, lng: -46.6333, aqi: 110, status: "Unhealthy for Sensitive Groups" },
        { id: 10, city: "Mumbai", lat: 19.0760, lng: 72.8777, aqi: 165, status: "Unhealthy" }
    ];

    return NextResponse.json(MOCK_AQI_DATA);
}
