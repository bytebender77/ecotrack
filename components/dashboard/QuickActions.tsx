"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bus, Utensils, Zap, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
    const actions = [
        {
            label: "Log Transport",
            icon: Bus,
            href: "/calculator?tab=transport",
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            label: "Log Meal",
            icon: Utensils,
            href: "/calculator?tab=food",
            color: "bg-emerald-500 hover:bg-emerald-600",
        },
        {
            label: "Log Energy",
            icon: Zap,
            href: "/calculator?tab=energy",
            color: "bg-amber-500 hover:bg-amber-600",
        },
    ];

    return (
        <Card className="col-span-full md:col-span-1">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Rapidly log your daily activities</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {actions.map((action, index) => (
                    <Link key={index} href={action.href} className="w-full">
                        <Button className={`w-full justify-start gap-2 ${action.color} text-white`}>
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </Button>
                    </Link>
                ))}
                <Link href="/activities" className="w-full">
                    <Button variant="outline" className="w-full justify-start gap-2">
                        <PlusCircle className="h-4 w-4" />
                        View All Activities
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
