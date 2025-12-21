"use client";

import { useEffect, useState } from "react";
import ChallengeCard from "./ChallengeCard";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

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

export default function ChallengeList() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const res = await fetch('/api/challenges');
            const data = await res.json();

            // Handle new API response structure
            if (data.challenges) {
                setChallenges(data.challenges);
                setJoinedChallenges(new Set(data.joinedChallengeIds || []));
            } else {
                // Fallback for old response structure
                setChallenges(data);
            }
        } catch (error) {
            console.error("Failed to fetch challenges", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (challengeId: string) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please log in to join challenges",
                variant: "destructive"
            });
            return;
        }

        try {
            const res = await fetch('/api/challenges/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ challengeId })
            });

            if (res.ok) {
                setJoinedChallenges(prev => new Set(Array.from(prev).concat(challengeId)));
                toast({
                    title: "Challenge Joined! 🎉",
                    description: "Good luck on your eco-friendly journey!",
                });
            } else {
                const error = await res.json();
                toast({
                    title: "Failed to Join",
                    description: error.message || "Something went wrong",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Join error:", error);
            toast({
                title: "Error",
                description: "Failed to join challenge",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (challenges.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No active challenges at the moment</p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon for new eco-challenges!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
                <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={handleJoin}
                    joined={joinedChallenges.has(challenge.id)}
                    progress={joinedChallenges.has(challenge.id) ? Math.floor(Math.random() * 60) : 0}
                />
            ))}
        </div>
    );
}
