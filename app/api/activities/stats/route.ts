import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { startOfDay, subDays, format, getDay } from 'date-fns';

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json([], { status: 200 });

    try {
        const today = new Date();
        const startDate = subDays(today, 6); // Last 7 days

        // Fetch activities for the last 7 days
        const activities = await db.activity.findMany({
            where: {
                userId: session.id as string,
                date: {
                    gte: startOfDay(startDate),
                }
            }
        });

        // Initialize last 7 days with 0 data
        const chartData: { date: string; day: string; transport: number; food: number; energy: number; }[] = [];
        for (let i = 0; i < 7; i++) {
            const d = subDays(today, 6 - i);
            chartData.push({
                date: format(d, 'yyyy-MM-dd'),
                day: format(d, 'EEE'), // Mon, Tue...
                transport: 0,
                food: 0,
                energy: 0,
            });
        }

        // Aggregate data
        activities.forEach(activity => {
            const activityDate = format(new Date(activity.date), 'yyyy-MM-dd');
            const dayStat = chartData.find(d => d.date === activityDate);

            if (dayStat && activity.type) {
                const type = activity.type;
                // Ensure the type is one of our tracked categories before adding
                if ((type === 'transport' || type === 'food' || type === 'energy') && activity.carbonImpact) {
                    // @ts-ignore
                    dayStat[type] += activity.carbonImpact;
                }
            }
        });

        return NextResponse.json(chartData);
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return NextResponse.json({ message: 'Error fetching stats' }, { status: 500 });
    }
}
