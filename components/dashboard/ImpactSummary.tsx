"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getImpactEquivalences, getImpactMessage } from "@/lib/impactEquivalence";
import { TreeDeciduous, Sparkles } from "lucide-react";

export default function ImpactSummary() {
    const { user } = useAuth();

    if (!user) return null;

    // Calculate total impact (avoided - emitted = net positive if more avoided)
    const carbonAvoided = user.carbonAvoided || 0;
    const carbonEmitted = user.carbonEmitted || 0;
    const netImpact = -carbonAvoided + carbonEmitted; // Negative means positive impact

    const equivalences = getImpactEquivalences(netImpact);
    const message = getImpactMessage(netImpact);

    if (equivalences.length === 0) {
        return null; // Don't show if no meaningful equivalences
    }

    return (
        <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                        <TreeDeciduous className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-emerald-800 dark:text-emerald-200">Your Real-World Impact</CardTitle>
                        <p className="text-xs text-muted-foreground">See what your actions mean for the planet</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Equivalence Cards */}
                <div className="grid gap-3 md:grid-cols-3">
                    {equivalences.map((eq, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-emerald-100 dark:border-emerald-800"
                        >
                            <span className="text-3xl">{eq.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                        {eq.value}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{eq.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Motivational Message */}
                <div className="flex items-center gap-2 p-3 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-lg">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        {message}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
