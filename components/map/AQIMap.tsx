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

// Accessible AQI Levels with emojis, colors, and friendly messages
export const AQI_LEVELS = [
    {
        min: 0,
        max: 50,
        label: "Good",
        color: "#22C55E",
        emoji: "🌿",
        message: "Fresh air, enjoy the outdoors!"
    },
    {
        min: 51,
        max: 100,
        label: "Okay",
        color: "#FACC15",
        emoji: "🙂",
        message: "Mostly safe, slight caution."
    },
    {
        min: 101,
        max: 200,
        label: "Moderate",
        color: "#FB923C",
        emoji: "😐",
        message: "Sensitive groups should be careful."
    },
    {
        min: 201,
        max: 300,
        label: "Poor",
        color: "#EF4444",
        emoji: "😷",
        message: "Limit outdoor activities."
    },
    {
        min: 301,
        max: 400,
        label: "Very Poor",
        color: "#A855F7",
        emoji: "😖",
        message: "Better to stay indoors."
    },
    {
        min: 401,
        max: 500,
        label: "Severe",
        color: "#1F2937",
        emoji: "🚨",
        message: "Avoid outdoor exposure."
    }
];

// Get AQI level info for a given value
const getAQILevel = (aqi: number) => {
    return AQI_LEVELS.find(level => aqi >= level.min && aqi <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
};

const getColor = (aqi: number) => getAQILevel(aqi).color;

const getStatus = (aqi: number) => {
    const level = getAQILevel(aqi);
    return `${level.emoji} ${level.label}`;
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
                            <div className="text-center p-2 min-w-[180px]">
                                <h3 className="font-bold text-lg">{point.city}</h3>
                                <div className="text-3xl font-bold my-2" style={{ color: getColor(point.aqi) }}>
                                    {getAQILevel(point.aqi).emoji} {point.aqi}
                                </div>
                                <p className="text-sm font-bold mb-1" style={{ color: getColor(point.aqi) }}>
                                    {getAQILevel(point.aqi).label} Air Quality
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {getAQILevel(point.aqi).message}
                                </p>
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
                            {AQI_LEVELS.map((level) => (
                                <div key={level.label} className="flex items-start gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px]"
                                        style={{ backgroundColor: level.color }}
                                    >
                                        {level.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                            {level.emoji} {level.min}-{level.max} : {level.label}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {level.message}
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

