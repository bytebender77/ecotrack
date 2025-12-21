"use client";

import StatsCards from "@/components/dashboard/StatsCards";
import EmissionChart from "@/components/dashboard/EmissionChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import ImpactSummary from "@/components/dashboard/ImpactSummary";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/DateRangePicker";
import { useAuth } from "@/context/AuthContext";

// Need to implement DateRangePicker or remove it for now. I'll remove it for now to avoid errors.

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50">
                    Dashboard
                </h2>
                <div className="flex items-center space-x-2">
                    {/* Date Range Picker Placeholder */}
                    <Button>Download Report</Button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <StatsCards />

            {/* Real-World Impact Summary */}
            <ImpactSummary />

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Charts Section */}
                <EmissionChart />

                {/* Right Sidebar: Quick Actions & Feed */}
                <div className="col-span-1 lg:col-span-3 space-y-4">
                    <QuickActions />
                    <ActivityFeed />
                </div>

            </div>
        </div>
    );
}

