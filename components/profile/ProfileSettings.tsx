"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Leaf, Trophy, Flame, TrendingUp, User as UserIcon, Bell, Lock, Globe, Camera, Sparkles, Share2, ExternalLink, AlertTriangle, RotateCcw, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfileSettings() {
    const { user, refreshUser } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [notifications, setNotifications] = useState(user?.notifications ?? true);
    const [publicProfile, setPublicProfile] = useState(user?.publicProfile ?? true);
    const [resetting, setResetting] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast({
                    title: "File too large 📷",
                    description: "Please choose an image under 2MB",
                    variant: "destructive"
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
                toast({
                    title: "Looking great! 🌱",
                    description: "Don't forget to save your changes!",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        // Only include fields that have actual values to prevent clearing
        const updateData: Record<string, string> = {};
        if (name && name.trim()) updateData.name = name.trim();
        if (email && email.trim()) updateData.email = email.trim();
        if (avatar) updateData.avatar = avatar;

        if (Object.keys(updateData).length === 0) {
            toast({
                title: "No Changes",
                description: "Please enter some data to update.",
                variant: "destructive"
            });
            return;
        }

        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            if (res.ok) {
                toast({
                    title: "Profile Updated! ✅",
                    description: "Your profile information has been saved.",
                });
                if (refreshUser) refreshUser();
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

    const handleResetStats = async () => {
        if (confirmText !== "RESET") {
            toast({
                title: "Confirmation Failed",
                description: "Please type 'RESET' to confirm.",
                variant: "destructive"
            });
            return;
        }

        setResetting(true);
        try {
            const res = await fetch('/api/user/reset', {
                method: 'POST',
            });

            if (res.ok) {
                toast({
                    title: "Stats Reset 🔄",
                    description: "Your eco stats have been reset to zero.",
                });
                setConfirmText("");
                if (refreshUser) refreshUser();
            } else {
                throw new Error('Failed to reset stats');
            }
        } catch (error) {
            toast({
                title: "Reset Failed",
                description: "Could not reset your stats.",
                variant: "destructive"
            });
        } finally {
            setResetting(false);
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
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Avatar className="h-24 w-24 ring-4 ring-emerald-100 dark:ring-emerald-900">
                                <AvatarImage src={avatar || user.avatar || undefined} />
                                <AvatarFallback className="text-3xl bg-gradient-to-br from-emerald-400 to-green-500 text-white">
                                    {user.name?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="h-6 w-6 text-white" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                <p className="font-medium text-emerald-700 dark:text-emerald-400">Profile Picture</p>
                            </div>
                            <p className="text-sm text-muted-foreground italic">
                                🌿 Add a pic of you with a plant — it’s giving eco-warrior vibes! 🌱
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                Upload Photo
                            </Button>
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

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    </div>
                    <CardDescription>Irreversible actions that affect your account data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-3">
                            <RotateCcw className="h-5 w-5 text-red-500 mt-0.5" />
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h4 className="font-semibold text-red-700 dark:text-red-400">Reset All Stats</h4>
                                    <p className="text-sm text-red-600 dark:text-red-500">
                                        This will permanently delete all your activities and reset your Eco Score,
                                        carbon stats, and streak to zero. This action cannot be undone.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-reset" className="text-red-600 dark:text-red-500 text-xs">
                                        Type <strong>RESET</strong> to confirm
                                    </Label>
                                    <Input
                                        id="confirm-reset"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        placeholder="Type RESET to confirm"
                                        className="border-red-200 dark:border-red-800 max-w-xs"
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={handleResetStats}
                                    disabled={resetting || confirmText !== "RESET"}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {resetting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Reset All Stats
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
