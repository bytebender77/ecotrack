"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResultDisplay from "./ResultDisplay";
import { EMISSION_FACTORS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FoodCalculator() {
    const [diet, setDiet] = useState("vegetarian");
    const [meals, setMeals] = useState("1"); // number of meals
    const [result, setResult] = useState(0);

    const calculate = () => {
        const count = parseFloat(meals);
        if (isNaN(count)) return;

        // @ts-ignore
        const factor = EMISSION_FACTORS.food[diet] || 0;
        setResult(count * factor);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/activities/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'food',
                    action: diet,
                    carbonImpact: result,
                    description: `Consumed ${meals} ${diet} meal(s)`
                })
            });

            if (!response.ok) throw new Error('Failed to save');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Food Footprint</CardTitle>
                <CardDescription>Estimate emissions from your diet per meal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Meal Type</Label>
                    <Select onValueChange={setDiet} defaultValue={diet}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="meat">Meat Meal</SelectItem>
                            <SelectItem value="chicken">Chicken Meal</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian Meal</SelectItem>
                            <SelectItem value="vegan">Vegan Meal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={calculate} className="w-full">Calculate Impact</Button>

                <ResultDisplay emission={result} category="food" onSave={handleSave} />
            </CardContent>
        </Card>
    );
}
