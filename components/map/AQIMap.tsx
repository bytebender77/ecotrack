"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Loader2, Navigation } from "lucide-react";

interface AQIPoint {
    id: number;
    city: string;
    lat: number;
    lng: number;
    aqi: number;
    status: string;
}

const getColor = (aqi: number) => {
    if (aqi <= 50) return "#22c55e"; // Green - Good
    if (aqi <= 100) return "#eab308"; // Yellow - Moderate
    if (aqi <= 150) return "#f97316"; // Orange - Unhealthy for Sensitive
    if (aqi <= 200) return "#ef4444"; // Red - Unhealthy
    if (aqi <= 300) return "#a855f7"; // Purple - Very Unhealthy
    return "#7f1d1d"; // Maroon - Hazardous
};

// Component to handle map center updates
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, 12); // Zoom level 12 for city view
    return null;
}

export default function AQIMap() {
    const [points, setPoints] = useState<AQIPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState<[number, number]>([20, 0]); // Default global
    const [userLocation, setUserLocation] = useState<boolean>(false);

    useEffect(() => {
        // Try getting user location first
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter([latitude, longitude]);
                    setUserLocation(true);
                    fetchData(latitude, longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    fetchData(); // Fallback to global data
                }
            );
        } else {
            fetchData();
        }
    }, []);

    const fetchData = async (lat?: number, lng?: number) => {
        try {
            let url = '/api/aqi';
            if (lat && lng) {
                url += `?lat=${lat}&lng=${lng}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setPoints(data);
        } catch (error) {
            console.error("Failed to fetch AQI data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <Card className="h-[600px] w-full overflow-hidden border-none shadow-lg relative">
            <MapContainer center={center} zoom={userLocation ? 12 : 2} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <ChangeView center={center} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {points.map((point) => (
                    <CircleMarker
                        key={point.id}
                        center={[point.lat, point.lng]}
                        pathOptions={{ color: getColor(point.aqi), fillColor: getColor(point.aqi), fillOpacity: 0.7 }}
                        radius={userLocation ? 30 : 10} // Bigger dot for user location
                    >
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-lg">{point.city}</h3>
                                <div className="text-2xl font-bold my-2" style={{ color: getColor(point.aqi) }}>
                                    {point.aqi} AQI
                                </div>
                                <p className="text-sm font-medium">{point.status}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
            {userLocation && (
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 px-4 py-2 rounded-full shadow-md z-[400] flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-blue-500 fill-blue-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Live Location Active</span>
                </div>
            )}
        </Card>
    );
}
