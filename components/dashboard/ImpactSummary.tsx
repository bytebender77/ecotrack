"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getImpactEquivalences, getImpactMessage } from "@/lib/impactEquivalence";
import { TreeDeciduous, Sparkles, AlertTriangle } from "lucide-react";

export default function ImpactSummary() {
    const { user } = useAuth();

    if (!user) return null;

    // Calculate total impact (avoided - emitted = net positive if more avoided)
    const carbonAvoided = user.carbonAvoided || 0;
    const carbonEmitted = user.carbonEmitted || 0;
    const netImpact = -carbonAvoided + carbonEmitted; // Negative means positive impact
    const isPositive = netImpact < 0;

    const equivalences = getImpactEquivalences(netImpact);
    const message = getImpactMessage(netImpact);

    if (equivalences.length === 0) {
        return null; // Don't show if no meaningful equivalences
    }

    // Dynamic colors based on positive/negative impact
    const cardBg = isPositive
        ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950"
        : "bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-950 dark:via-orange-950 dark:to-amber-950";
    const iconBg = isPositive
        ? "bg-emerald-100 dark:bg-emerald-900"
        : "bg-red-100 dark:bg-red-900";
    const iconColor = isPositive ? "text-emerald-600" : "text-red-600";
    const titleColor = isPositive
        ? "text-emerald-800 dark:text-emerald-200"
        : "text-red-800 dark:text-red-200";
    const valueColor = isPositive
        ? "text-emerald-700 dark:text-emerald-400"
        : "text-red-700 dark:text-red-400";
    const cardBorder = isPositive
        ? "border-emerald-100 dark:border-emerald-800"
        : "border-red-100 dark:border-red-800";
    const messageBg = isPositive
        ? "bg-emerald-100/50 dark:bg-emerald-900/30"
        : "bg-red-100/50 dark:bg-red-900/30";

    return (
        <Card className={`border-none shadow-md ${cardBg}`}>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-2 ${iconBg} rounded-lg`}>
                        {isPositive ? (
                            <TreeDeciduous className={`h-5 w-5 ${iconColor}`} />
                        ) : (
                            <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
                        )}
                    </div>
                    <div>
                        <CardTitle className={`text-lg ${titleColor}`}>
                            {isPositive ? "Your Real-World Impact" : "Your Carbon Footprint"}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {isPositive ? "See what your actions saved" : "See what your activities emitted"}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Equivalence Cards */}
                <div className="grid gap-3 md:grid-cols-3">
                    {equivalences.map((eq, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg border ${cardBorder}`}
                        >
                            <span className="text-3xl">{eq.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-2xl font-bold ${valueColor}`}>
                                        {eq.value}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{eq.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Motivational Message */}
                <div className={`flex items-center gap-2 p-3 ${messageBg} rounded-lg`}>
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <p className={`text-sm font-medium ${titleColor}`}>
                        {message}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
