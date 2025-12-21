"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Leaf, Trophy, Flame, TrendingUp, User as UserIcon, Bell, Lock, Globe } from "lucide-react";

export default function ProfileSettings() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [notifications, setNotifications] = useState(user?.notifications ?? true);
    const [publicProfile, setPublicProfile] = useState(user?.publicProfile ?? true);

    const handleSaveProfile = async () => {
        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });

            if (res.ok) {
                toast({
                    title: "Profile Updated! ✅",
                    description: "Your profile information has been saved.",
                });
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not save your profile changes.",
                variant: "destructive"
            });
        }
    };

    const handleSaveSettings = async () => {
        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notifications, publicProfile })
            });

            if (res.ok) {
                toast({
                    title: "Settings Updated! ✅",
                    description: "Your preferences have been saved.",
                });
            } else {
                throw new Error('Failed to update settings');
            }
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not save your settings.",
                variant: "destructive"
            });
        }
    };

    if (!user) {
        return <div className="text-center py-12 text-muted-foreground">Please log in to view your profile.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                    <CardTitle>Your Impact</CardTitle>
                    <CardDescription>Your environmental contribution at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                                <Leaf className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{(user.totalSaved || 0).toFixed(1)} kg</p>
                                <p className="text-xs text-muted-foreground">CO₂ Saved</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                <Trophy className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{user.ecoScore || 0}</p>
                                <p className="text-xs text-muted-foreground">Eco Score</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <Flame className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{user.streakCurrent || 0}</p>
                                <p className="text-xs text-muted-foreground">Day Streak</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{user.streakLongest || 0}</p>
                                <p className="text-xs text-muted-foreground">Best Streak</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Information */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        <CardTitle>Profile Information</CardTitle>
                    </div>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="text-2xl">{user.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-muted-foreground">Profile Picture</p>
                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG or SVG. Max 2MB</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <Button onClick={handleSaveProfile} className="bg-emerald-600 hover:bg-emerald-700">
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            {/* Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Preferences</CardTitle>
                    </div>
                    <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive updates about your eco activities and challenges
                            </p>
                        </div>
                        <Switch
                            checked={notifications}
                            onCheckedChange={setNotifications}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Public Profile</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow others to see your profile on the leaderboard
                            </p>
                        </div>
                        <Switch
                            checked={publicProfile}
                            onCheckedChange={setPublicProfile}
                        />
                    </div>

                    <Button onClick={handleSaveSettings} variant="outline">
                        Save Preferences
                    </Button>
                </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        <CardTitle>Account Security</CardTitle>
                    </div>
                    <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline">
                        Change Password
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
