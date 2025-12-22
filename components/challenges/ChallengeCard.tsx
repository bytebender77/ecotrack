"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar, Target, CheckCircle, Gift, PartyPopper, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Challenge {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    target: any;
    reward: number;
    startDate: Date | string | null;
    endDate: Date | string | null;
    isActive: boolean;
}

interface ChallengeCardProps {
    challenge: Challenge;
    onJoin: (challengeId: string) => void;
    joined?: boolean;
    progress?: number;
    completed?: boolean;
    onClaimReward?: (challengeId: string) => void;
}

export default function ChallengeCard({ challenge, onJoin, joined = false, progress = 0, completed = false, onClaimReward }: ChallengeCardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [claiming, setClaiming] = useState(false);

    const endDate = challenge.endDate ? new Date(challenge.endDate) : null;
    const timeRemaining = endDate ? formatDistanceToNow(endDate, { addSuffix: true }) : "Ongoing";

    const isCompleted = completed || progress >= 100;

    const getCategoryColor = (category: string | null) => {
        switch (category) {
            case 'transport': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'food': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'energy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const handleClaimReward = async () => {
        if (!onClaimReward) return;
        setClaiming(true);
        try {
            await onClaimReward(challenge.id);
        } finally {
            setClaiming(false);
        }
    };

    return (
        <Card className={`hover:shadow-lg transition-shadow ${isCompleted ? 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : ''}`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="h-5 w-5 text-emerald-600" />
                            {challenge.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{challenge.description}</CardDescription>
                    </div>
                    {isCompleted ? (
                        <Badge className="ml-2 bg-emerald-600 text-white">
                            <PartyPopper className="h-3 w-3 mr-1" />
                            Completed!
                        </Badge>
                    ) : joined ? (
                        <Badge variant="secondary" className="ml-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Joined
                        </Badge>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {challenge.category && (
                        <Badge className={getCategoryColor(challenge.category)}>
                            {challenge.category}
                        </Badge>
                    )}
                    <Badge variant="outline" className="capitalize">
                        {challenge.type}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Ends {timeRemaining}</span>
                </div>

                <div className={`flex items-center gap-2 text-sm font-medium ${isCompleted ? 'text-amber-600' : 'text-emerald-600'}`}>
                    <Trophy className="h-4 w-4" />
                    <span>{challenge.reward} points reward</span>
                    {isCompleted && <Gift className="h-4 w-4 ml-1 animate-bounce" />}
                </div>

                {joined && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className={`font-medium ${isCompleted ? 'text-emerald-600' : ''}`}>{Math.min(progress, 100)}%</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} className={`h-2 ${isCompleted ? '[&>div]:bg-emerald-500' : ''}`} />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {!joined ? (
                    <Button
                        onClick={() => onJoin(challenge.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={!user}
                    >
                        Join Challenge
                    </Button>
                ) : isCompleted && !completed ? (
                    <Button
                        onClick={handleClaimReward}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                        disabled={claiming}
                    >
                        {claiming ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Claiming...
                            </>
                        ) : (
                            <>
                                <Gift className="h-4 w-4 mr-2" />
                                Claim {challenge.reward} Points! 🎉
                            </>
                        )}
                    </Button>
                ) : completed ? (
                    <Button variant="outline" className="w-full text-emerald-600 border-emerald-600" disabled>
                        <Trophy className="h-4 w-4 mr-2" />
                        Reward Claimed! ✨
                    </Button>
                ) : (
                    <Button variant="outline" className="w-full" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Challenge Active
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

