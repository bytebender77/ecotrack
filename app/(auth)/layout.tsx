export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-emerald-600 tracking-tight">
                        EcoTrack 🌍
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Track your impact. Save the planet.
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}
