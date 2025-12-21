import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
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
            const carbon = parseFloat(activity.carbonImpact || '0');
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
                description: a.description,
                carbon: parseFloat(a.carbonImpact || '0'),
                points: Math.round(parseFloat(a.carbonImpact || '0') * 2),
                date: a.createdAt
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
            carbonEmitted: user.carbonEmitted || 0,
            carbonAvoided: user.carbonAvoided || 0,
            ecoScore: user.ecoScore || 0
        });

    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
