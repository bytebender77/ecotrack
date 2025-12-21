"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ACTIVITY_CATALOG } from "@/lib/activities";
import { Calculator, Leaf, TrendingDown, TrendingUp } from "lucide-react";

export default function PointsGuidePage() {
    // Group activities by category
    const categorizedActivities = ACTIVITY_CATALOG.reduce((acc, activity) => {
        if (!acc[activity.category]) {
            acc[activity.category] = [];
        }
        acc[activity.category].push(activity);
        return acc;
    }, {} as Record<string, typeof ACTIVITY_CATALOG>);

    const categoryInfo: Record<string, { icon: string; title: string; description: string }> = {
        transport: {
            icon: '🚗',
            title: 'Transport',
            description: 'Carbon emissions from different modes of transportation'
        },
        device: {
            icon: '📱',
            title: 'Device & Energy',
            description: 'Emissions from electronic device usage'
        },
        food: {
            icon: '🍽️',
            title: 'Food',
            description: 'Carbon impact of dietary choices'
        },
        green: {
            icon: '🌱',
            title: 'Green Actions',
            description: 'Positive environmental actions that offset carbon'
        },
        student: {
            icon: '📚',
            title: 'Student Tasks',
            description: 'Sustainable choices in student life'
        },
        lifestyle: {
            icon: '🧺',
            title: 'Lifestyle',
            description: 'Daily lifestyle carbon footprint'
        }
    };

    return (
        <div className="container py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50 mb-2">
                    📊 How Points Work
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Complete reference guide for carbon calculations and point scoring
                </p>
            </div>

            {/* Formula Explanation */}
            <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-2 border-emerald-300 dark:border-emerald-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        The Formula
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-emerald-500">
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Step 1: Calculate Carbon</p>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                Carbon (kg CO₂) = Quantity × Emission Factor
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-blue-500">
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Step 2: Calculate Points</p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                EcoPoints = -Carbon × 2
                            </p>
                            <p className="text-xs text-gray-500">Positive carbon → Negative points | Negative carbon → Positive points</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <TrendingDown className="h-5 w-5 text-red-600 mt-1" />
                            <div>
                                <p className="font-semibold text-red-900 dark:text-red-100">Emissions (Positive Carbon)</p>
                                <p className="text-sm text-red-700 dark:text-red-300">Result in <strong>negative points</strong></p>
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Example: Car 10km = +2.4kg = -5 pts</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-emerald-600 mt-1" />
                            <div>
                                <p className="font-semibold text-emerald-900 dark:text-emerald-100">Avoidance (Negative Carbon)</p>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">Result in <strong>positive points</strong></p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Example: Walk 10km = -2.4kg = +5 pts</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Tables by Category */}
            {Object.entries(categorizedActivities).map(([category, activities]) => {
                const info = categoryInfo[category];
                if (!info) return null;

                return (
                    <Card key={category} className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">{info.icon}</span>
                                {info.title}
                            </CardTitle>
                            <CardDescription>{info.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2">Activity</th>
                                            <th className="text-right py-3 px-2">Emission Factor</th>
                                            <th className="text-right py-3 px-2">Example (10 units)</th>
                                            <th className="text-right py-3 px-2">Carbon</th>
                                            <th className="text-right py-3 px-2">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activities.map((activity) => {
                                            const exampleQty = 10;
                                            const carbon = exampleQty * activity.carbonPerUnit;
                                            const points = Math.round(-carbon * 2);
                                            const isPositive = carbon < 0;

                                            return (
                                                <tr key={activity.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="py-3 px-2">
                                                        <div>
                                                            <p className="font-medium">{activity.name}</p>
                                                            <p className="text-xs text-gray-500">{activity.description}</p>
                                                        </div>
                                                    </td>
                                                    <td className="text-right py-3 px-2 font-mono text-sm">
                                                        {activity.carbonPerUnit.toFixed(3)} kg/{activity.unit}
                                                    </td>
                                                    <td className="text-right py-3 px-2 text-gray-600 dark:text-gray-400">
                                                        {exampleQty} {activity.unit}
                                                    </td>
                                                    <td className={`text-right py-3 px-2 font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {carbon >= 0 ? '+' : ''}{carbon.toFixed(2)} kg
                                                    </td>
                                                    <td className={`text-right py-3 px-2 font-bold ${points > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {points >= 0 ? '+' : ''}{points} pts
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

            {/* Real Examples */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700">
                <CardHeader>
                    <CardTitle>💡 Real-World Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-semibold mb-2">🚗 Car Trip (500 km)</p>
                            <div className="text-sm space-y-1 font-mono">
                                <p>Carbon = 500 km × 0.24 = <span className="text-red-600 font-bold">+120 kg CO₂</span></p>
                                <p>Points = -120 × 2 = <span className="text-red-600 font-bold">-240 pts</span></p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-semibold mb-2">🚴 Cycling to College (5 km daily × 5 days)</p>
                            <div className="text-sm space-y-1 font-mono">
                                <p>Carbon = 25 km × (-0.24) = <span className="text-emerald-600 font-bold">-6 kg CO₂</span></p>
                                <p>Points = -(-6) × 2 = <span className="text-emerald-600 font-bold">+12 pts</span></p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-semibold mb-2">🌳 Plant a Tree</p>
                            <div className="text-sm space-y-1 font-mono">
                                <p>Carbon = 1 tree × (-20) = <span className="text-emerald-600 font-bold">-20 kg CO₂/year</span></p>
                                <p>Points = -(-20) × 2 = <span className="text-emerald-600 font-bold">+40 pts</span> 🎉</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-semibold mb-2">🍽️ Vegetarian Meals (3 per week for 1 year)</p>
                            <div className="text-sm space-y-1 font-mono">
                                <p>Carbon = 156 meals × (-2.0) = <span className="text-emerald-600 font-bold">-312 kg CO₂/year</span></p>
                                <p>Points = -(-312) × 2 = <span className="text-emerald-600 font-bold">+624 pts</span> 🌱</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tips */}
            <Card className="mt-6 border-2 border-emerald-300 dark:border-emerald-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-emerald-600" />
                        Pro Tips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Walking and cycling give the <strong>same points</strong> as driving would cost - choose wisely!</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Planting one tree = <strong>offsetting 83 km of car travel</strong> (or 40 points!)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Choosing vegetarian just 3x/week = <strong>+624 points/year</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-600">✓</span>
                            <span>Small daily choices add up: digital notes, reusable bottles, shorter showers!</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
