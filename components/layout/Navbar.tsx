"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import MobileNav from "@/components/layout/MobileNav";

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
                    <Link href="/profile" className="flex items-center gap-2">
                        <span className="text-sm font-medium hidden md:block">{user.name}</span>
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                            {user.avatar ? <img src={user.avatar} className="rounded-full" alt="User" /> : <UserCircle className="h-5 w-5" />}
                        </div>
                    </Link>
                )}
            </div>
        </header>
    );
}
