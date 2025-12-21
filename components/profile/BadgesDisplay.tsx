"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getUnlockedBadges, getNextBadges, getTierBorder, Badge } from "@/lib/badges";
import { Award, Lock, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function BadgesDisplay() {
    const { user } = useAuth();

    if (!user) return null;

    const stats = {
        ecoScore: user.ecoScore || 0,
        carbonAvoided: user.carbonAvoided || 0,
        streakCurrent: user.streakCurrent || 0,
        streakLongest: user.streakLongest || 0,
        completedChallenges: 0, // TODO: Get from API
    };

    const unlockedBadges = getUnlockedBadges(stats);
    const nextBadges = getNextBadges(stats, 3);

    return (
        <Card className="border-none shadow-md">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                        <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Achievement Badges</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {unlockedBadges.length} of {unlockedBadges.length + nextBadges.length + 10} unlocked
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Unlocked Badges */}
                {unlockedBadges.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <span className="text-emerald-600">✨ Unlocked</span>
                        </h3>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {unlockedBadges.map((badge) => (
                                <BadgeItem key={badge.id} badge={badge} unlocked={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Next Badges to Unlock */}
                {nextBadges.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span>Next to Unlock</span>
                        </h3>
                        <div className="space-y-3">
                            {nextBadges.map(({ badge, progress }) => (
                                <div
                                    key={badge.id}
                                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                                >
                                    <div className="relative">
                                        <span className="text-3xl opacity-50 grayscale">{badge.icon}</span>
                                        <Lock className="h-3 w-3 absolute -bottom-1 -right-1 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{badge.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{badge.description}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Progress value={progress} className="h-2 flex-1" />
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {progress.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {unlockedBadges.length === 0 && nextBadges.length === 0 && (
                    <div className="text-center py-8">
                        <span className="text-4xl">🏅</span>
                        <p className="text-muted-foreground mt-2">Start logging activities to earn badges!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function BadgeItem({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
    return (
        <div
            className={`
                relative flex flex-col items-center justify-center p-2 rounded-lg
                transition-all hover:scale-110 cursor-pointer group
                ${unlocked
                    ? `bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-2 ${getTierBorder(badge.tier)}`
                    : 'bg-gray-100 dark:bg-gray-800 opacity-50 grayscale'
                }
            `}
            title={`${badge.name}: ${badge.description}`}
        >
            <span className="text-2xl sm:text-3xl">{badge.icon}</span>
            <span className="text-[10px] font-medium mt-1 text-center leading-tight truncate w-full">
                {badge.name}
            </span>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 w-40">
                <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-gray-300">{badge.description}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
            </div>
        </div>
    );
}
