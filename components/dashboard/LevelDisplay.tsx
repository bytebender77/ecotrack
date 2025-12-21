"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getCurrentLevel, getNextLevel, getLevelProgress, getPointsToNextLevel, LEVELS } from "@/lib/levels";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Sparkles } from "lucide-react";

export default function LevelDisplay() {
    const { user } = useAuth();

    if (!user) return null;

    const ecoScore = user.ecoScore || 0;
    const currentLevel = getCurrentLevel(ecoScore);
    const nextLevel = getNextLevel(ecoScore);
    const progress = getLevelProgress(ecoScore);
    const pointsNeeded = getPointsToNextLevel(ecoScore);

    return (
        <Card className={`border-none shadow-md overflow-hidden ${currentLevel.bgColor}`}>
            <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                    {/* Level Icon */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-lg">
                            <span className="text-4xl">{currentLevel.icon}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full px-2 py-0.5 text-xs font-bold shadow border">
                            Lv.{currentLevel.level}
                        </div>
                    </div>

                    {/* Level Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className={`text-xl font-bold ${currentLevel.color}`}>
                                {currentLevel.title}
                            </h3>
                            {currentLevel.level === LEVELS.length && (
                                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {currentLevel.description}
                        </p>

                        {/* Progress to next level */}
                        {nextLevel && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="font-medium">{ecoScore} pts</span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <span>{nextLevel.icon}</span>
                                        <span>{nextLevel.title}</span>
                                        <span>({nextLevel.minPoints} pts)</span>
                                    </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="font-semibold text-emerald-600">{pointsNeeded}</span> points to next level
                                </p>
                            </div>
                        )}

                        {!nextLevel && (
                            <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-sm font-medium">Maximum level achieved!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Level Journey */}
                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                        {LEVELS.slice(0, 5).map((level, index) => (
                            <div
                                key={level.level}
                                className="flex flex-col items-center"
                            >
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-lg
                                    ${ecoScore >= level.minPoints
                                        ? 'bg-emerald-100 dark:bg-emerald-900'
                                        : 'bg-gray-100 dark:bg-gray-800 opacity-50 grayscale'
                                    }
                                `}>
                                    {level.icon}
                                </div>
                                {index < 4 && (
                                    <ChevronRight className={`h-3 w-3 mt-1 ${ecoScore >= LEVELS[index + 1]?.minPoints
                                            ? 'text-emerald-500'
                                            : 'text-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
