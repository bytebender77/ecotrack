"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Leaf, TrendingUp, Activity } from "lucide-react";

interface AnalyticsData {
    carbonByCategory: Record<string, number>;
    pointsByCategory: Record<string, number>;
    activityCounts: Record<string, number>;
    totalCarbon: number;
    totalPoints: number;
    totalActivities: number;
    carbonEmitted: number;
    carbonAvoided: number;
    ecoScore: number;
    topActivities: Array<{
        description: string;
        carbon: number;
        points: number;
        date: string;
    }>;
}

const COLORS = {
    transport: '#ef4444', // red
    food: '#f97316', // orange
    device: '#8b5cf6', // purple
    energy: '#eab308', // yellow
    green: '#22c55e', // green
    student: '#3b82f6', // blue
    lifestyle: '#ec4899' // pink
};

const CATEGORY_ICONS: Record<string, string> = {
    transport: '🚗',
    food: '🍽️',
    device: '📱',
    energy: '⚡',
    green: '🌱',
    student: '📚',
    lifestyle: '🧺'
};

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics');
            if (response.ok) {
                const analyticsData = await response.json();
                setData(analyticsData);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-8">
                <div className="text-center">Loading analytics...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container py-8">
                <div className="text-center">No data available. Start logging activities!</div>
            </div>
        );
    }

    // Prepare chart data
    const carbonChartData = Object.entries(data.carbonByCategory)
        .filter(([_, value]) => value !== 0)
        .map(([category, value]) => ({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            value: Math.abs(value),
            rawValue: value,
            icon: CATEGORY_ICONS[category]
        }));

    const pointsChartData = Object.entries(data.pointsByCategory)
        .filter(([_, value]) => value !== 0)
        .map(([category, value]) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1),
            points: value,
            icon: CATEGORY_ICONS[category]
        }));

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50 mb-2">
                    📊 Analytics & Insights
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Visualize your environmental impact and track your progress
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-500" />
                            {data.totalActivities}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Net Carbon Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold flex items-center gap-2 ${data.totalCarbon < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            <Leaf className="h-5 w-5" />
                            {data.totalCarbon.toFixed(2)} kg
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {data.totalCarbon < 0 ? '✅ Carbon negative!' : '⚠️ Work to reduce emissions'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Eco Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold flex items-center gap-2 ${data.ecoScore >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            <TrendingUp className="h-5 w-5" />
                            {data.ecoScore} pts
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Carbon Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Carbon by Category</CardTitle>
                        <CardDescription>Breakdown of your carbon impact</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {carbonChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={carbonChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value.toFixed(1)} kg`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {carbonChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value.toFixed(2)} kg`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-gray-500">No activities logged yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Points Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Points by Category</CardTitle>
                        <CardDescription>Where you're earning/losing points</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pointsChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pointsChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="points" fill="#22c55e" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-gray-500">No activities logged yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>Detailed view of your impact by category</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(data.carbonByCategory)
                            .filter(([_, carbon]) => carbon !== 0)
                            .map(([category, carbon]) => {
                                const points = data.pointsByCategory[category];
                                const count = data.activityCounts[category];
                                const icon = CATEGORY_ICONS[category];

                                return (
                                    <div key={category} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{icon}</span>
                                            <div>
                                                <h3 className="font-semibold capitalize">{category}</h3>
                                                <p className="text-sm text-gray-500">{count} activities</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${carbon < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {carbon.toFixed(2)} kg CO₂
                                            </p>
                                            <p className={`text-sm ${points >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {points >= 0 ? '+' : ''}{points} points
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
