"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getTodaysQuests, checkQuestProgress, getDifficultyColor, Quest } from "@/lib/quests";
import { Target, Gift, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TodayActivity {
    type: string;
    action: string;
}

export default function DailyQuests() {
    const { user } = useAuth();
    const [todaysActivities, setTodaysActivities] = useState<TodayActivity[]>([]);
    const [loading, setLoading] = useState(true);

    const quests = getTodaysQuests();

    useEffect(() => {
        fetchTodaysActivities();
    }, []);

    const fetchTodaysActivities = async () => {
        try {
            const res = await fetch('/api/activities/today');
            if (res.ok) {
                const data = await res.json();
                setTodaysActivities(data);
            }
        } catch (error) {
            console.error("Failed to fetch today's activities", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate time until reset (midnight)
    const getTimeUntilReset = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const completedCount = quests.filter(q => checkQuestProgress(q, todaysActivities).completed).length;
    const totalReward = quests.reduce((sum, q) => {
        const { completed } = checkQuestProgress(q, todaysActivities);
        return sum + (completed ? q.reward : 0);
    }, 0);

    if (!user) return null;

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Target className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Daily Quests</CardTitle>
                            <p className="text-xs text-muted-foreground">Complete quests for bonus points</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Resets in {getTimeUntilReset()}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress Summary */}
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">{completedCount}/{quests.length} Completed</span>
                    </div>
                    {totalReward > 0 && (
                        <div className="flex items-center gap-1 text-emerald-600">
                            <Gift className="h-4 w-4" />
                            <span className="font-bold">+{totalReward} pts earned</span>
                        </div>
                    )}
                </div>

                {/* Quest List */}
                <div className="space-y-3">
                    {quests.map((quest) => {
                        const { completed, progress } = checkQuestProgress(quest, todaysActivities);

                        return (
                            <QuestItem
                                key={quest.id}
                                quest={quest}
                                completed={completed}
                                progress={progress}
                            />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

function QuestItem({ quest, completed, progress }: { quest: Quest; completed: boolean; progress: number }) {
    return (
        <div className={`
            p-3 rounded-lg border transition-all
            ${completed
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }
        `}>
            <div className="flex items-start gap-3">
                <span className="text-2xl">{quest.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}>
                            {quest.title}
                        </h4>
                        <Badge variant="outline" className={`text-[10px] h-4 ${getDifficultyColor(quest.difficulty)}`}>
                            {quest.difficulty}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{quest.description}</p>

                    {!completed && (
                        <div className="mt-2">
                            <Progress value={progress} className="h-1.5" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-amber-600">
                                <Gift className="h-3 w-3" />
                                <span className="text-xs font-bold">+{quest.reward}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
