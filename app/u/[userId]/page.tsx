"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Leaf, Trophy, Flame, Calendar, TrendingUp, Award,
    TreeDeciduous, Loader2, ArrowLeft, Share2, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentLevel, getNextLevel, getLevelProgress } from "@/lib/levels";
import { getUnlockedBadges } from "@/lib/badges";
import { formatDistanceToNow } from "date-fns";
import AvatarWithModal from "@/components/ui/AvatarWithModal";

interface UserProfile {
    id: string;
    name: string;
    avatar: string | null;
    ecoScore: number;
    carbonEmitted: number;
    carbonAvoided: number;
    streakCurrent: number;
    streakLongest: number;
    createdAt: string;
    completedChallenges: number;
}

interface Activity {
    id: string;
    type: string;
    action: string;
    carbonImpact: number;
    date: string;
    points: number;
}

export default function PublicProfilePage() {
    const params = useParams();
    const userId = params.userId as string;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/public/profile/${userId}`);
            if (!res.ok) {
                if (res.status === 404) {
                    setError("User not found");
                } else {
                    setError("Failed to load profile");
                }
                return;
            }
            const data = await res.json();
            setProfile(data.user);
            setActivities(data.recentActivities || []);
        } catch (err) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Profile link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{error || "User not found"}</h1>
                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Home
                    </Button>
                </Link>
            </div>
        );
    }

    const currentLevel = getCurrentLevel(profile.ecoScore);
    const nextLevel = getNextLevel(profile.ecoScore);
    const levelProgress = getLevelProgress(profile.ecoScore);

    const badges = getUnlockedBadges({
        ecoScore: profile.ecoScore,
        carbonAvoided: profile.carbonAvoided,
        streakCurrent: profile.streakCurrent,
        streakLongest: profile.streakLongest,
        completedChallenges: profile.completedChallenges
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
                        <Leaf className="h-5 w-5" />
                        <span className="font-bold">EcoTrack</span>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Profile
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Profile Header */}
                <Card className="border-none shadow-lg overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
                    <CardContent className="relative pt-0 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                            <AvatarWithModal
                                src={profile.avatar}
                                name={profile.name}
                                className="h-24 w-24 ring-4 ring-white dark:ring-gray-800 shadow-xl"
                                fallbackClassName="text-2xl"
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    {profile.name}
                                </h1>
                                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                    <span className="text-2xl">{currentLevel.icon}</span>
                                    <span className={`font-semibold ${currentLevel.color}`}>
                                        {currentLevel.title}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                        Level {currentLevel.level}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Member since {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-4 text-center">
                            <Trophy className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {profile.ecoScore}
                            </p>
                            <p className="text-xs text-muted-foreground">Eco Score</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-4 text-center">
                            <Flame className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {profile.streakCurrent}
                            </p>
                            <p className="text-xs text-muted-foreground">Day Streak</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-4 text-center">
                            <TreeDeciduous className="h-6 w-6 mx-auto text-emerald-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {profile.carbonAvoided.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">kg CO₂ Avoided</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-4 text-center">
                            <Award className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {badges.length}
                            </p>
                            <p className="text-xs text-muted-foreground">Badges Earned</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Level Progress */}
                {nextLevel && (
                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{currentLevel.icon}</span>
                                    <span className="font-medium">{currentLevel.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="text-xl">{nextLevel.icon}</span>
                                    <span className="text-sm">{nextLevel.title}</span>
                                </div>
                            </div>
                            <Progress value={levelProgress} className="h-2" />
                            <p className="text-xs text-muted-foreground text-center mt-2">
                                {profile.ecoScore} / {nextLevel.minPoints} pts
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Badges */}
                {badges.length > 0 && (
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="h-5 w-5 text-amber-500" />
                                Badges Earned
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950 rounded-lg"
                                        title={badge.description}
                                    >
                                        <span className="text-2xl">{badge.icon}</span>
                                        <span className="text-sm font-medium">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Activities */}
                {activities.length > 0 && (
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                Recent Activities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {activities.slice(0, 5).map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={activity.carbonImpact < 0 ? "default" : "destructive"}
                                            className={activity.carbonImpact < 0 ? "bg-emerald-100 text-emerald-700" : ""}
                                        >
                                            {activity.carbonImpact < 0 ? "+" : ""}{Math.abs(activity.carbonImpact).toFixed(2)} kg
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                        🌱 Join {profile.name} on EcoTrack and start your eco journey!
                    </p>
                    <Link href="/register">
                        <Button className="mt-2 bg-emerald-600 hover:bg-emerald-700">
                            Create Your Profile
                            <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
