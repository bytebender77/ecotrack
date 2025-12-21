"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransportCalculator from "./TransportCalculator";
import FoodCalculator from "./FoodCalculator";
import EnergyCalculator from "./EnergyCalculator";
import DeviceCalculator from "./DeviceCalculator";
import GreenActionsCalculator from "./GreenActionsCalculator";
import StudentTasksCalculator from "./StudentTasksCalculator";

export default function CalculatorTabs() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") || "transport";

    return (
        <Tabs defaultValue={defaultTab} className="w-full max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-6 mb-8">
                <TabsTrigger value="transport">🚗 Transport</TabsTrigger>
                <TabsTrigger value="food">🍽️ Food</TabsTrigger>
                <TabsTrigger value="energy">⚡ Energy</TabsTrigger>
                <TabsTrigger value="device">📱 Device</TabsTrigger>
                <TabsTrigger value="green">🌱 Green</TabsTrigger>
                <TabsTrigger value="student">📚 Student</TabsTrigger>
            </TabsList>

            <TabsContent value="transport">
                <TransportCalculator />
            </TabsContent>

            <TabsContent value="food">
                <FoodCalculator />
            </TabsContent>

            <TabsContent value="energy">
                <EnergyCalculator />
            </TabsContent>

            <TabsContent value="device">
                <DeviceCalculator />
            </TabsContent>

            <TabsContent value="green">
                <GreenActionsCalculator />
            </TabsContent>

            <TabsContent value="student">
                <StudentTasksCalculator />
            </TabsContent>
        </Tabs>
    );
}
