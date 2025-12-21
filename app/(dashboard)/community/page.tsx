"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search, Users, Loader2, Trophy, Flame, TreeDeciduous,
    ChevronLeft, ChevronRight, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { getCurrentLevel } from "@/lib/levels";

interface CommunityUser {
    id: string;
    name: string;
    avatar: string | null;
    ecoScore: number;
    carbonAvoided: number;
    streakCurrent: number;
    country: string | null;
    createdAt: string;
}

export default function CommunityPage() {
    const [users, setUsers] = useState<CommunityUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async (searchQuery = "") => {
        setLoading(true);
        try {
            const query = searchQuery || search;
            const res = await fetch(`/api/public/users?search=${query}&page=${page}&limit=12`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotalPages(data.totalPages);
                setTotal(data.total);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers(search);
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50 flex items-center gap-2">
                        <Users className="h-8 w-8 text-emerald-600" />
                        Community
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Discover eco-warriors and see their profiles
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="outline">
                        Search
                    </Button>
                </form>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-emerald-600">{total}</span> eco-warriors found
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
            )}

            {/* User Grid */}
            {!loading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {users.map((user) => {
                        const level = getCurrentLevel(user.ecoScore);
                        return (
                            <Link key={user.id} href={`/u/${user.id}`}>
                                <Card className="border-none shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-14 w-14 ring-2 ring-emerald-100 dark:ring-emerald-900 group-hover:ring-emerald-400 transition-all">
                                                <AvatarImage src={user.avatar || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-green-500 text-white font-bold">
                                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold truncate group-hover:text-emerald-600 transition-colors">
                                                        {user.name}
                                                    </h3>
                                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <span className="text-lg">{level.icon}</span>
                                                    <span className={`font-medium ${level.color}`}>{level.title}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Trophy className="h-3 w-3 text-yellow-500" />
                                                <span className="font-bold">{user.ecoScore}</span>
                                                <span className="text-muted-foreground">pts</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Flame className="h-3 w-3 text-orange-500" />
                                                <span className="font-bold">{user.streakCurrent}</span>
                                                <span className="text-muted-foreground">days</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <TreeDeciduous className="h-3 w-3 text-emerald-500" />
                                                <span className="font-bold">{user.carbonAvoided.toFixed(0)}</span>
                                                <span className="text-muted-foreground">kg</span>
                                            </div>
                                        </div>

                                        {/* Country Badge */}
                                        {user.country && (
                                            <Badge variant="outline" className="mt-3 text-[10px]">
                                                📍 {user.country}
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!loading && users.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No users found</h3>
                    <p className="text-muted-foreground">Try a different search term</p>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}
