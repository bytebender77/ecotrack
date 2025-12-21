"use client";

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Dynamic import for Leaflet map to avoid SSR issues
const AQIMap = dynamic(() => import('@/components/map/AQIMap'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading Map...</div>
});

export default function MapPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50">
                    Global Air Quality Map
                </h2>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
                <div className="lg:col-span-3">
                    <AQIMap />
                </div>

                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AQI Legend</CardTitle>
                            <CardDescription>Understanding the Index</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
                                <span className="text-sm">0-50: Good</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-[#eab308]"></div>
                                <span className="text-sm">51-100: Moderate</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-[#f97316]"></div>
                                <span className="text-sm">101-150: Unhealthy for Sensitive</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                                <span className="text-sm">151-200: Unhealthy</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-[#a855f7]"></div>
                                <span className="text-sm">201-300: Very Unhealthy</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full bg-[#7f1d1d]"></div>
                                <span className="text-sm">300+: Hazardous</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
