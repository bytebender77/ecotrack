"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResultDisplay from "./ResultDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivity } from "@/lib/activities";

export default function DeviceCalculator() {
    const [device, setDevice] = useState("phone_usage");
    const [hours, setHours] = useState("");
    const [result, setResult] = useState(0);

    const calculate = () => {
        const hrs = parseFloat(hours);
        if (isNaN(hrs)) return;

        const activity = getActivity(device);
        if (!activity) return;

        setResult(hrs * activity.carbonPerUnit);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/activities/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'device',
                    action: device,
                    carbonImpact: result,
                    description: `Used ${device.replace('_', ' ')} for ${hours} hours`
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
                <CardTitle>Device & Energy Usage</CardTitle>
                <CardDescription>Track emissions from your daily device usage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Device Type</Label>
                        <Select onValueChange={setDevice} defaultValue={device}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select device" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="phone_usage">📱 Phone Usage</SelectItem>
                                <SelectItem value="laptop_usage">💻 Laptop Usage</SelectItem>
                                <SelectItem value="gaming">🎮 Gaming</SelectItem>
                                <SelectItem value="ac_usage">❄️ Air Conditioner</SelectItem>
                                <SelectItem value="fan_usage">🌀 Fan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Usage (hours)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 5"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                        />
                    </div>
                </div>

                <Button onClick={calculate} className="w-full">Calculate Impact</Button>

                <ResultDisplay emission={result} category="device" onSave={handleSave} />
            </CardContent>
        </Card>
    );
}
