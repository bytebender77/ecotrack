"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResultDisplay from "./ResultDisplay";
import { EMISSION_FACTORS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EnergyCalculator() {
    const [source, setSource] = useState("electricity_grid");
    const [usage, setUsage] = useState("");
    const [result, setResult] = useState(0);

    const calculate = () => {
        const kwh = parseFloat(usage);
        if (isNaN(kwh)) return;

        // @ts-ignore
        const factor = EMISSION_FACTORS.energy[source] || 0;
        setResult(kwh * factor);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/activities/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'energy',
                    action: `${usage} kWh ${source}`,
                    carbonImpact: result,
                    points: 20,
                    description: `Used ${usage} kWh of ${source}`
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
                <CardTitle>Home Energy</CardTitle>
                <CardDescription>Calculate based on monthly usage (kWh).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Energy Source</Label>
                        <Select onValueChange={setSource} defaultValue={source}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electricity_grid">Standard Grid</SelectItem>
                                <SelectItem value="electricity_green">Green/Solar</SelectItem>
                                <SelectItem value="natural_gas">Natural Gas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Usage (kWh)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 100"
                            value={usage}
                            onChange={(e) => setUsage(e.target.value)}
                        />
                    </div>
                </div>

                <Button onClick={calculate} className="w-full">Calculate Impact</Button>

                <ResultDisplay emission={result} category="energy" onSave={handleSave} />
            </CardContent>
        </Card>
    );
}
