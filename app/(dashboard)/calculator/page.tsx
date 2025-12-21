"use client";

import { Suspense } from "react";
import CalculatorTabs from "@/components/calculator/CalculatorTabs";

export default function CalculatorPage() {
    return (
        <div className="container py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50 mb-2">
                    Carbon Calculator
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Estimate your carbon footprint and find ways to reduce it.
                </p>
            </div>

            <Suspense fallback={<div>Loading calculator...</div>}>
                <CalculatorTabs />
            </Suspense>
        </div>
    );
}
