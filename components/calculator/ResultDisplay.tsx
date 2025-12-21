"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

interface ResultDisplayProps {
    emission: number; // in kg CO2
    category: string;
    onSave?: () => Promise<void>;
}

export default function ResultDisplay({ emission, category, onSave }: ResultDisplayProps) {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // if (emission === 0) return null; // Removed to allow 0 emission (e.g. biking) to be logged

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

    // Simple equivalent logic
    const treesPlanted = (emission / 20).toFixed(1); // approx 20kg per tree/year
    const carKm = (emission / 0.192).toFixed(1);

    // Determine color/message based on emission
    const isZero = emission === 0;
    const colorClass = isZero ? "text-emerald-600 dark:text-emerald-400" : "text-emerald-600 dark:text-emerald-400"; // Keep same for now or make red if high

    if (isNaN(emission)) return null; // Safety check

    return (
        <Card className="mt-6 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-emerald-900 dark:text-emerald-100">
                        Estimated Impact
                    </h3>
                    <div className="mt-2 flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            {emission.toFixed(2)}
                        </span>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            kg CO₂
                        </span>
                    </div>
                    <p className="mt-4 text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                        That's equivalent to driving a car for <strong>{carKm} km</strong> or the yearly absorption of <strong>{treesPlanted} trees</strong>.
                    </p>

                    {onSave && (
                        <Button
                            onClick={handleSave}
                            disabled={loading || saved}
                            variant={saved ? "outline" : "default"}
                            className={saved ? "border-emerald-500 text-emerald-600" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
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
