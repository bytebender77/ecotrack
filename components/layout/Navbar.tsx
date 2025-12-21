"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import MobileNav from "@/components/layout/MobileNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 w-full">
            <div className="lg:hidden">
                <MobileNav />
            </div>
            <div className="w-full flex-1">
                {/* Search implementation could go here */}
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                    >
                        <span className="text-sm font-medium hidden md:block text-gray-700 dark:text-gray-300 group-hover:text-emerald-600">
                            {user.name}
                        </span>
                        <Avatar className="h-9 w-9 ring-2 ring-emerald-100 dark:ring-emerald-900 group-hover:ring-emerald-400 transition-all">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-green-500 text-white font-bold">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                )}
            </div>
        </header>
    );
}
