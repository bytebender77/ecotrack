import ChallengeList from "@/components/challenges/ChallengeList";

export default function ChallengesPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50">
                        Eco Challenges
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Join challenges to earn points and make a difference
                    </p>
                </div>
            </div>
            <ChallengeList />
        </div>
    );
}
