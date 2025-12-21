"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransportCalculator from "./TransportCalculator";
import FoodCalculator from "./FoodCalculator";
import EnergyCalculator from "./EnergyCalculator";

export default function CalculatorTabs() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") || "transport";

    return (
        <Tabs defaultValue={defaultTab} className="w-full max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="transport">Transport</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="energy">Energy</TabsTrigger>
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
        </Tabs>
    );
}
