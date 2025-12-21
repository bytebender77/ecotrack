"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
// Wait, I don't have Sheet. I should use Dialog or create Sheet component.
// I'll stick to a simple mobile nav using the Sidebar component or similar logic for now, or just placeholder.
// Actually, using Sheet from shadcn would be best but I haven't implemented it.
// I will implement a basic mobile nav using my existing Dialog or just a simple state.

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
// Sidebar is fixed position, might need modification for mobile specifically or just reuse structure.
// I'll rewrite a simple mobile menu here.

import Link from "next/link";
import {
    LayoutDashboard,
    Calculator,
    ListTodo,
    Trophy,
    Map as MapIcon,
    Leaf,
    User,
    LogOut,
    Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";


const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calculator, label: "Calculator", href: "/calculator" },
    { icon: ListTodo, label: "Activities", href: "/activities" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
    { icon: Target, label: "Challenges", href: "/challenges" },
    { icon: MapIcon, label: "Map", href: "/map" },
    { icon: Leaf, label: "Alternatives", href: "/alternatives" },
    { icon: User, label: "Profile", href: "/profile" },
];

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
                    <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg border-r sm:max-w-sm overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <Link className="flex items-center gap-2 font-semibold" href="/dashboard" onClick={() => setIsOpen(false)}>
                                <Leaf className="h-6 w-6 text-emerald-600" />
                                <span className="text-xl font-bold text-emerald-900 dark:text-emerald-50">EcoTrack</span>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <nav className="grid gap-2 text-lg font-medium">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                                        pathname === item.href
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-8 pt-6 border-t">
                            <Button variant="ghost" className="w-full justify-start gap-4 text-red-500" onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}>
                                <LogOut className="h-5 w-5" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
