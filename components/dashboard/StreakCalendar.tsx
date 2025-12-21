"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityDay {
    date: string;
    count: number;
    carbonImpact: number;
}

export default function StreakCalendar() {
    const { user } = useAuth();
    const [activityData, setActivityData] = useState<Map<string, ActivityDay>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivityHistory();
    }, []);

    const fetchActivityHistory = async () => {
        try {
            const res = await fetch('/api/activities/history');
            if (res.ok) {
                const data = await res.json();
                const activityMap = new Map<string, ActivityDay>();

                data.forEach((activity: any) => {
                    const date = new Date(activity.date).toISOString().split('T')[0];
                    const existing = activityMap.get(date);

                    if (existing) {
                        existing.count += 1;
                        existing.carbonImpact += Math.abs(activity.carbonImpact || 0);
                    } else {
                        activityMap.set(date, {
                            date,
                            count: 1,
                            carbonImpact: Math.abs(activity.carbonImpact || 0)
                        });
                    }
                });

                setActivityData(activityMap);
            }
        } catch (error) {
            console.error("Failed to fetch activity history", error);
        } finally {
            setLoading(false);
        }
    };

    // Generate last 12 weeks of dates
    const generateCalendarDays = () => {
        const days: string[] = [];
        const today = new Date();

        for (let i = 83; i >= 0; i--) { // 12 weeks = 84 days
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }

        return days;
    };

    const getIntensity = (count: number): number => {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count <= 3) return 2;
        if (count <= 5) return 3;
        return 4;
    };

    const getIntensityColor = (intensity: number): string => {
        switch (intensity) {
            case 0: return "bg-gray-100 dark:bg-gray-800";
            case 1: return "bg-emerald-200 dark:bg-emerald-900";
            case 2: return "bg-emerald-400 dark:bg-emerald-700";
            case 3: return "bg-emerald-500 dark:bg-emerald-600";
            case 4: return "bg-emerald-600 dark:bg-emerald-500";
            default: return "bg-gray-100 dark:bg-gray-800";
        }
    };

    const calendarDays = generateCalendarDays();
    const weeks: string[][] = [];

    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
    }

    const totalActiveDays = Array.from(activityData.values()).filter(d => d.count > 0).length;

    if (!user) return null;

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <CalendarDays className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Activity Streak</CardTitle>
                            <p className="text-xs text-muted-foreground">Last 12 weeks of eco actions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950 px-3 py-1.5 rounded-full">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-bold text-orange-600">{user.streakCurrent || 0} days</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Calendar Grid */}
                <div className="overflow-x-auto">
                    <div className="flex gap-1 min-w-fit">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-1">
                                {week.map((day) => {
                                    const activity = activityData.get(day);
                                    const count = activity?.count || 0;
                                    const intensity = getIntensity(count);
                                    const isToday = day === new Date().toISOString().split('T')[0];

                                    return (
                                        <div
                                            key={day}
                                            className={cn(
                                                "w-4 h-4 rounded-sm transition-all hover:scale-125 cursor-pointer",
                                                getIntensityColor(intensity),
                                                isToday && "ring-2 ring-blue-500"
                                            )}
                                            title={`${day}: ${count} activities`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-emerald-600">{totalActiveDays}</span> active days in last 12 weeks
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Less</span>
                        <div className="flex gap-0.5">
                            {[0, 1, 2, 3, 4].map((intensity) => (
                                <div
                                    key={intensity}
                                    className={cn("w-3 h-3 rounded-sm", getIntensityColor(intensity))}
                                />
                            ))}
                        </div>
                        <span>More</span>
                    </div>
                </div>

                {/* Streak Info */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{user.streakCurrent || 0}</p>
                        <p className="text-xs text-muted-foreground">Current Streak</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">{user.streakLongest || 0}</p>
                        <p className="text-xs text-muted-foreground">Longest Streak</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
