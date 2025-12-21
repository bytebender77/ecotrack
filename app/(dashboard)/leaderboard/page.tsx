import Leaderboard from "@/components/leaderboard/Leaderboard";

export default function LeaderboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50">
                    Leaderboard
                </h2>
            </div>
            <div className="max-w-4xl mx-auto">
                <Leaderboard />
            </div>
        </div>
    );
}
