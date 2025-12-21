"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Medal, Trophy, Crown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface LeaderboardUser {
    id: string;
    name: string;
    avatar: string | null;
    ecoScore: number;
    totalSaved: number;
    country: string | null;
    streakCurrent: number;
    rank: number;
}

export default function Leaderboard() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    const topThree = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <div className="space-y-8">
            {/* Podium Section */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8 items-end max-w-3xl mx-auto pt-8">
                {/* 2nd Place */}
                {topThree[1] && (
                    <Link href={`/u/${topThree[1].id}`} className="flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
                        <div className="relative mb-4">
                            <Avatar className="h-20 w-20 border-4 border-slate-300 shadow-xl">
                                <AvatarImage src={topThree[1].avatar || undefined} />
                                <AvatarFallback>{topThree[1].name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded-full text-sm shadow-sm flex items-center gap-1">
                                <span className="text-xs">2</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{topThree[1].name}</h3>
                            <p className="text-emerald-600 font-bold text-sm">{topThree[1].ecoScore} pts</p>
                        </div>
                        <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-t-lg mt-4 opacity-50"></div>
                    </Link>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <Link href={`/u/${topThree[0].id}`} className="flex flex-col items-center z-10 -mt-8 hover:scale-105 transition-transform cursor-pointer">
                        <div className="relative mb-4">
                            <Crown className="w-8 h-8 text-yellow-500 absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" />
                            <Avatar className="h-28 w-28 border-4 border-yellow-400 shadow-2xl ring-4 ring-yellow-400/20">
                                <AvatarImage src={topThree[0].avatar || undefined} />
                                <AvatarFallback>{topThree[0].name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-bold px-3 py-0.5 rounded-full text-base shadow-lg flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                <span>1</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-50 truncate max-w-[150px]">{topThree[0].name}</h3>
                            <p className="text-emerald-600 font-extrabold text-lg">{topThree[0].ecoScore} pts</p>
                            <p className="text-xs text-muted-foreground">{topThree[0].totalSaved.toFixed(0)} kg CO2 saved</p>
                        </div>
                        <div className="h-32 w-full bg-gradient-to-t from-yellow-200 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/20 rounded-t-lg mt-4 shadow-inner"></div>
                    </Link>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <Link href={`/u/${topThree[2].id}`} className="flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
                        <div className="relative mb-4">
                            <Avatar className="h-20 w-20 border-4 border-orange-300 shadow-xl">
                                <AvatarImage src={topThree[2].avatar || undefined} />
                                <AvatarFallback>{topThree[2].name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-300 text-orange-900 font-bold px-2 py-0.5 rounded-full text-sm shadow-sm flex items-center gap-1">
                                <span className="text-xs">3</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{topThree[2].name}</h3>
                            <p className="text-emerald-600 font-bold text-sm">{topThree[2].ecoScore} pts</p>
                        </div>
                        <div className="h-20 w-full bg-orange-100 dark:bg-orange-950/40 rounded-t-lg mt-4 opacity-50"></div>
                    </Link>
                )}
            </div>

            {/* List Section */}
            <Card className="border-none shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {rest.map((user) => (
                            <Link
                                key={user.id}
                                href={`/u/${user.id}`}
                                className={cn(
                                    "flex items-center p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 cursor-pointer group",
                                    currentUser?.id === user.id && "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                                )}
                            >
                                <div className="w-8 font-bold text-gray-500 text-center mr-4">#{user.rank}</div>
                                <Avatar className="h-10 w-10 border mr-4">
                                    <AvatarImage src={user.avatar || undefined} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                                        {user.name}
                                        {currentUser?.id === user.id && <Badge variant="secondary" className="text-[10px] h-5">You</Badge>}
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </p>
                                    <p className="text-xs text-muted-foreground">{user.country || "Earth"} • {user.streakCurrent} day streak</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-emerald-600">{user.ecoScore} pts</div>
                                    <div className="text-xs text-muted-foreground">{user.totalSaved.toFixed(1)} kg saved</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
