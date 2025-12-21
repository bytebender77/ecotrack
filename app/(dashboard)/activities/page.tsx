import ActivityList from "@/components/activities/ActivityList";

export default function ActivitiesPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50">
                        Activity History
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        View and track all your eco-friendly activities
                    </p>
                </div>
            </div>
            <ActivityList />
        </div>
    );
}
