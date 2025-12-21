"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
    BarChart3,
    BookOpen,
    Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calculator, label: "Calculator", href: "/calculator" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: BookOpen, label: "How Points Work", href: "/points-guide" },
    { icon: ListTodo, label: "Activities", href: "/activities" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Target, label: "Challenges", href: "/challenges" },
    { icon: MapIcon, label: "Map", href: "/map" },
    { icon: Leaf, label: "Alternatives", href: "/alternatives" },
    { icon: User, label: "Profile", href: "/profile" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-full h-screen sticky top-0 flex flex-col z-30">
            <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
                <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                    <span className="text-xl font-bold text-emerald-900 dark:text-emerald-50">EcoTrack</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-emerald-600 dark:hover:text-emerald-400",
                                pathname === item.href
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                                    : "text-gray-500 dark:text-gray-400"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => logout()}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
