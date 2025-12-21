"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResultDisplay from "./ResultDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivity } from "@/lib/activities";

export default function GreenActionsCalculator() {
    const [action, setAction] = useState("plant_tree");
    const [quantity, setQuantity] = useState("1");
    const [result, setResult] = useState(0);

    const calculate = () => {
        const qty = parseFloat(quantity);
        if (isNaN(qty)) return;

        const activity = getActivity(action);
        if (!activity) return;

        setResult(qty * activity.carbonPerUnit);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/activities/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'green',
                    action: action,
                    carbonImpact: result,
                    description: `${action.replace('_', ' ')}: ${quantity} ${getActivity(action)?.unit || 'item'}(s)`
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
                <CardTitle>🌱 Green Actions</CardTitle>
                <CardDescription>Log your positive environmental impact!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Green Action</Label>
                    <Select onValueChange={setAction} defaultValue={action}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="plant_tree">🌳 Plant a Tree (+40 pts!)</SelectItem>
                            <SelectItem value="composting">♻️ Composting</SelectItem>
                            <SelectItem value="campus_cleanup">🧹 Campus Cleanup</SelectItem>
                            <SelectItem value="water_saving">💧 Water Saving</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>
                        {/* Dynamic label based on activity unit */}
                        {action === 'plant_tree' && 'Number of Trees'}
                        {action === 'composting' && 'Weight (kg)'}
                        {action === 'campus_cleanup' && 'Waste Collected (kg)'}
                        {action === 'water_saving' && 'Water Saved (liters)'}
                    </Label>
                    <Input
                        type="number"
                        placeholder={
                            action === 'plant_tree' ? 'e.g. 1' :
                                action === 'composting' ? 'e.g. 5' :
                                    action === 'campus_cleanup' ? 'e.g. 10' :
                                        'e.g. 50'
                        }
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <Button onClick={calculate} className="w-full">Calculate Impact</Button>

                <ResultDisplay emission={result} category="green" onSave={handleSave} />
            </CardContent>
        </Card>
    );
}
