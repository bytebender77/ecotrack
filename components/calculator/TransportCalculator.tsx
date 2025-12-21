"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResultDisplay from "./ResultDisplay";
import { EMISSION_FACTORS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Bus, Train, Bike, Plane } from "lucide-react";

export default function TransportCalculator() {
    const [mode, setMode] = useState("car");
    const [distance, setDistance] = useState("");
    const [result, setResult] = useState(0);

    const calculate = () => {
        const dist = parseFloat(distance);
        if (isNaN(dist)) return;

        // @ts-ignore
        const factor = EMISSION_FACTORS.transport[mode] || 0;
        setResult(dist * factor);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/activities/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'transport',
                    action: `${distance}km by ${mode}`,
                    carbonImpact: result,
                    points: 15,
                    description: `Traveled ${distance}km using ${mode}`
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
                <CardTitle>Transport Emission</CardTitle>
                <CardDescription>Calculate CO2 from your daily commute or trips.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Mode of Transport</Label>
                        <Select onValueChange={setMode} defaultValue={mode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="car">Car (Petrol)</SelectItem>
                                <SelectItem value="ev">Electric Vehicle</SelectItem>
                                <SelectItem value="bus">Bus</SelectItem>
                                <SelectItem value="train">Train</SelectItem>
                                <SelectItem value="flight">Flight</SelectItem>
                                <SelectItem value="bike">Bicycle</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Distance (km)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 15"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                        />
                    </div>
                </div>

                <Button onClick={calculate} className="w-full">Calculate Impact</Button>

                <ResultDisplay emission={result} category="transport" onSave={handleSave} />
            </CardContent>
        </Card>
    );
}
