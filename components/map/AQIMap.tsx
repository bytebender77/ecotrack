"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";
import { Loader2, Navigation, ChevronDown, ChevronUp } from "lucide-react";

interface AQIPoint {
    id: number;
    city: string;
    lat: number;
    lng: number;
    aqi: number;
    status: string;
}

// India CPCB AQI Standards
const AQI_LEGEND = [
    { range: "0-50", label: "Good", color: "#22c55e", description: "Air bilkul clean, koi tension nahi." },
    { range: "51-100", label: "Satisfactory", color: "#facc15", description: "Normal hai, bas sensitive log thoda feel kar sakte hain." },
    { range: "101-200", label: "Moderate", color: "#f97316", description: "Breathing issue ho sakta hai for heart/lung patients." },
    { range: "201-300", label: "Poor", color: "#ef4444", description: "Outdoor activity kam rakho, sabko discomfort ho sakta hai." },
    { range: "301-400", label: "Very Poor", color: "#a855f7", description: "Serious respiratory issues, bahar kam hi niklo." },
    { range: "401-500", label: "Severe", color: "#dc2626", description: "Emergency level, health pe direct impact." },
];

const getColor = (aqi: number) => {
    if (aqi <= 50) return "#22c55e"; // Green - Good
    if (aqi <= 100) return "#facc15"; // Yellow - Satisfactory
    if (aqi <= 200) return "#f97316"; // Orange - Moderate
    if (aqi <= 300) return "#ef4444"; // Red - Poor
    if (aqi <= 400) return "#a855f7"; // Purple - Very Poor
    return "#dc2626"; // Dark Red - Severe
};

const getStatus = (aqi: number) => {
    if (aqi <= 50) return "Good 🌿";
    if (aqi <= 100) return "Satisfactory 👍";
    if (aqi <= 200) return "Moderate ⚠️";
    if (aqi <= 300) return "Poor 😷";
    if (aqi <= 400) return "Very Poor 🚨";
    return "Severe ☠️";
};

// Component to handle map center updates
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, 12);
    return null;
}

export default function AQIMap() {
    const [points, setPoints] = useState<AQIPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState<[number, number]>([20, 0]);
    const [userLocation, setUserLocation] = useState<boolean>(false);
    const [showLegend, setShowLegend] = useState(true);

    useEffect(() => {
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
                    fetchData();
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
                        radius={userLocation ? 30 : 10}
                    >
                        <Popup>
                            <div className="text-center p-2">
                                <h3 className="font-bold text-lg">{point.city}</h3>
                                <div className="text-3xl font-bold my-2" style={{ color: getColor(point.aqi) }}>
                                    {point.aqi} AQI
                                </div>
                                <p className="text-sm font-medium">{getStatus(point.aqi)}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            {/* Live Location Badge */}
            {userLocation && (
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 px-4 py-2 rounded-full shadow-md z-[400] flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-blue-500 fill-blue-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Live Location Active</span>
                </div>
            )}

            {/* AQI Legend - India CPCB Standard */}
            <div className="absolute bottom-4 left-4 z-[400] max-w-xs">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                        onClick={() => setShowLegend(!showLegend)}
                        className="w-full px-4 py-2 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950 border-b border-gray-200 dark:border-gray-700"
                    >
                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200">🇮🇳 AQI Legend (India - CPCB)</span>
                        {showLegend ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </button>

                    {showLegend && (
                        <div className="p-3 space-y-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Understanding the Index</p>
                            {AQI_LEGEND.map((item) => (
                                <div key={item.range} className="flex items-start gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                            {item.range} : {item.label}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

