"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Car, Utensils, Zap, Calendar, TrendingDown, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Activity {
    id: string;
    type: string;
    action: string;
    description: string | null;
    carbonImpact: number;
    points: number;
    metadata: any;
    date: string;
}

export default function ActivityList() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch('/api/activities');
            const data = await res.json();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'transport': return Car;
            case 'food': return Utensils;
            case 'energy': return Zap;
            default: return Calendar;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'transport': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'food': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'energy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const filteredActivities = filter === "all"
        ? activities
        : activities.filter(a => a.type === filter);

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Tabs defaultValue="all" onValueChange={setFilter}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="transport">Transport</TabsTrigger>
                    <TabsTrigger value="food">Food</TabsTrigger>
                    <TabsTrigger value="energy">Energy</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6 space-y-4">
                    {filteredActivities.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">No activities logged yet</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Start by logging your eco-friendly actions in the Calculator!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredActivities.map((activity) => {
                            const Icon = getIcon(activity.type);
                            const isSaved = activity.carbonImpact > 0;

                            return (
                                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg capitalize">
                                                        {activity.action.replace(/_/g, ' ')}
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center gap-2 mt-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(new Date(activity.date))}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className={`flex items-center gap-1 font-bold ${isSaved ? 'text-emerald-600' : 'text-red-600'
                                                    }`}>
                                                    {isSaved ? (
                                                        <TrendingDown className="h-4 w-4" />
                                                    ) : (
                                                        <TrendingUp className="h-4 w-4" />
                                                    )}
                                                    <span>{Math.abs(activity.carbonImpact).toFixed(2)} kg CO₂</span>
                                                </div>
                                                {activity.points > 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{activity.points} pts
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {activity.description && (
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        </CardContent>
                                    )}
                                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                        <CardContent className="pt-0">
                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                {activity.metadata.distance && (
                                                    <span>Distance: {activity.metadata.distance} km</span>
                                                )}
                                                {activity.metadata.meals && (
                                                    <span>Meals: {activity.metadata.meals}</span>
                                                )}
                                                {activity.metadata.hours && (
                                                    <span>Hours: {activity.metadata.hours}</span>
                                                )}
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
