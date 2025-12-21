"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Activity {
    id: string;
    type: string;
    action: string;
    carbonImpact: number;
    date: string;
}

export default function ActivityFeed() {
    const { user } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchActivities = async () => {
            try {
                const res = await fetch('/api/activities');
                if (res.ok) {
                    const data = await res.json();
                    setActivities(data);
                }
            } catch (error) {
                console.error("Failed to fetch activities", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [user]);

    if (loading) {
        return (
            <Card className="col-span-1 min-h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </Card>
        );
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest eco-actions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground">No activities logged yet.</p>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center border mr-4 text-emerald-600 font-bold text-xs uppercase">
                                    {activity.type.slice(0, 2)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        <span className="font-semibold">You</span> {activity.action}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="font-medium text-xs text-emerald-600">
                                    {activity.carbonImpact > 0 ? `+${activity.carbonImpact} kg` : `${activity.carbonImpact} kg`}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
