"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Trophy, Flame, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatNumber } from "@/lib/utils";

export default function StatsCards() {
    const { user } = useAuth();

    if (!user) {
        return <StatsCardsSkeleton />;
    }

    const stats = [
        {
            title: "Total Carbon Saved",
            value: `${(user.totalSaved || 0).toFixed(1)} kg`,
            description: "Lifetime savings",
            icon: Leaf,
            color: "text-emerald-500",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
        },
        {
            title: "Eco Score",
            value: (user.ecoScore || 0).toString(),
            description: "Your environmental impact",
            icon: Trophy,
            color: "text-yellow-500",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Current Streak",
            value: `${user.streakCurrent || 0} days`,
            description: "Keep it up!",
            icon: Flame,
            color: "text-orange-500",
            bgColor: "bg-amber-100 dark:bg-amber-900/20",
        },
        {
            title: "Last Activity",
            value: user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : "None",
            description: "Keep being active!",
            icon: TrendingUp,
            color: "text-rose-500",
            bgColor: "bg-rose-100 dark:bg-rose-900/20",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function StatsCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
