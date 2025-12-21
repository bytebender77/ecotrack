"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResultDisplay from "./ResultDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivity } from "@/lib/activities";

export default function StudentTasksCalculator() {
    const [task, setTask] = useState("digital_notes");
    const [quantity, setQuantity] = useState("1");
    const [result, setResult] = useState(0);

    const calculate = () => {
        const qty = parseFloat(quantity);
        if (isNaN(qty)) return;

        const activity = getActivity(task);
        if (!activity) return;

        setResult(qty * activity.carbonPerUnit);
    };

    const handleSave = async () => {
        try {
            const activity = getActivity(task);
            const response = await fetch('/api/activities/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'student',
                    action: task,
                    carbonImpact: result,
                    description: `${activity?.name}: ${quantity} ${activity?.unit || 'item'}(s)`
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
                <CardTitle>📚 Student Tasks</CardTitle>
                <CardDescription>Track your sustainable student choices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Student Task</Label>
                    <Select onValueChange={setTask} defaultValue={task}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="digital_notes">📝 Digital Notes (vs printing)</SelectItem>
                            <SelectItem value="library_book">📖 Library Book (vs buying)</SelectItem>
                            <SelectItem value="online_class">💻 Online Class (vs commute)</SelectItem>
                            <SelectItem value="printed_pages">🖨️ Printed Pages</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>
                        {/* Dynamic label based on task unit */}
                        {task === 'digital_notes' && 'Number of Days'}
                        {task === 'library_book' && 'Number of Books'}
                        {task === 'online_class' && 'Number of Classes'}
                        {task === 'printed_pages' && 'Number of Pages'}
                    </Label>
                    <Input
                        type="number"
                        placeholder={
                            task === 'digital_notes' ? 'e.g. 5 days' :
                                task === 'library_book' ? 'e.g. 1 book' :
                                    task === 'online_class' ? 'e.g. 3 classes' :
                                        'e.g. 50 pages'
                        }
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <Button onClick={calculate} className="w-full">Calculate Impact</Button>

                <ResultDisplay emission={result} category="student" onSave={handleSave} />
            </CardContent>
        </Card>
    );
}
