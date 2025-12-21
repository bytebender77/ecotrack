import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { id: session.id as string },
            include: {
                activities: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Aggregate data by category
        const carbonByCategory: Record<string, number> = {
            transport: 0,
            food: 0,
            device: 0,
            energy: 0,
            green: 0,
            student: 0,
            lifestyle: 0
        };

        const pointsByCategory: Record<string, number> = {
            transport: 0,
            food: 0,
            device: 0,
            energy: 0,
            green: 0,
            student: 0,
            lifestyle: 0
        };

        const activityCounts: Record<string, number> = {
            transport: 0,
            food: 0,
            device: 0,
            energy: 0,
            green: 0,
            student: 0,
            lifestyle: 0
        };

        // Process each activity
        user.activities.forEach((activity) => {
            const category = activity.type;
            const carbon = activity.carbonImpact;
            const points = Math.round(carbon * 2); // 1 kg = 2 points

            if (carbonByCategory[category] !== undefined) {
                carbonByCategory[category] += carbon;
                pointsByCategory[category] += points;
                activityCounts[category] += 1;
            }
        });

        // Calculate totals
        const totalCarbon = Object.values(carbonByCategory).reduce((sum, val) => sum + val, 0);
        const totalPoints = Object.values(pointsByCategory).reduce((sum, val) => sum + val, 0);
        const totalActivities = user.activities.length;

        // Get top activities by carbon impact
        const topActivities = user.activities
            .map(a => ({
                description: a.description || a.action,
                carbon: a.carbonImpact,
                points: Math.round(a.carbonImpact * 2),
                date: a.date
            }))
            .sort((a, b) => Math.abs(b.carbon) - Math.abs(a.carbon))
            .slice(0, 5);

        return NextResponse.json({
            carbonByCategory,
            pointsByCategory,
            activityCounts,
            totalCarbon,
            totalPoints,
            totalActivities,
            topActivities,
            carbonEmitted: user.carbonEmitted,
            carbonAvoided: user.carbonAvoided,
            ecoScore: user.ecoScore
        });

    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
