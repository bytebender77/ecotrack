import ProfileSettings from "@/components/profile/ProfileSettings";

export default function ProfilePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50">
                        Your Profile
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>
            </div>
            <ProfileSettings />
        </div>
    );
}
