"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { getSmartComparison } from "@/lib/smartComparisons";

interface ResultDisplayProps {
    emission: number; // in kg CO2
    category: string;
    onSave?: () => Promise<void>;
}

export default function ResultDisplay({ emission, category, onSave }: ResultDisplayProps) {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        if (!onSave) return;
        setLoading(true);
        try {
            await onSave();
            setSaved(true);
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setLoading(false);
        }
    };

    if (isNaN(emission)) return null;

    // Get smart comparison based on category
    const smartComp = getSmartComparison(emission, category);

    // Determine if this is a positive action (negative carbon = good!)
    const isPositive = emission < 0;
    const absEmission = Math.abs(emission);

    // Color coding: Green for positive impact, Red for emissions
    const bgColor = isPositive
        ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800"
        : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800";

    const textColor = isPositive
        ? "text-emerald-900 dark:text-emerald-100"
        : "text-red-900 dark:text-red-100";

    const valueColor = isPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400";

    const buttonColor = isPositive
        ? "bg-emerald-600 hover:bg-emerald-700"
        : "bg-red-600 hover:bg-red-700";

    return (
        <Card className={`mt-6 ${bgColor}`}>
            <CardContent className="pt-6">
                <div className="text-center">
                    <h3 className={`text-lg font-medium ${textColor}`}>
                        Estimated Impact
                    </h3>
                    <div className="mt-2 flex items-baseline justify-center gap-2">
                        <span className={`text-4xl font-bold ${valueColor}`}>
                            {/* Show 3 decimals for values < 1, otherwise 2 decimals */}
                            {Math.abs(emission) < 1 ? emission.toFixed(3) : emission.toFixed(2)}
                        </span>
                        <span className={`text-sm font-medium ${valueColor}`}>
                            kg CO₂
                        </span>
                    </div>

                    {/* Smart, context-aware comparison */}
                    <p className={`mt-4 text-sm ${textColor} mb-4`}>
                        {smartComp.message}
                    </p>

                    {onSave && (
                        <Button
                            onClick={handleSave}
                            disabled={loading || saved}
                            variant={saved ? "outline" : "default"}
                            className={saved ? `border-${isPositive ? 'emerald' : 'red'}-500 text-${isPositive ? 'emerald' : 'red'}-600` : `${buttonColor} text-white`}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {saved && <CheckCircle className="mr-2 h-4 w-4" />}
                            {saved ? "Logged to Dashboard" : "Log Activity"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
