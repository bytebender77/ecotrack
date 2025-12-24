import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Snowflake, TreePine, Gift } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 text-emerald-400/20 animate-pulse">
                <TreePine className="w-24 h-24" />
            </div>
            <div className="absolute top-40 right-20 text-cyan-400/20 animate-pulse delay-300">
                <Snowflake className="w-16 h-16" />
            </div>
            <div className="absolute bottom-40 left-20 text-emerald-400/20 animate-pulse delay-500">
                <Gift className="w-20 h-20" />
            </div>
            <div className="absolute bottom-20 right-10 text-cyan-400/20 animate-pulse delay-700">
                <TreePine className="w-32 h-32" />
            </div>

            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-white/10 backdrop-blur-lg bg-white/5 relative z-10">
                <Link className="flex items-center justify-center gap-2" href="#">
                    <div className="p-2 rounded-lg bg-emerald-500/20 glow-emerald">
                        <Leaf className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="font-bold text-xl text-gradient">EcoTrack</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        href="/login"
                    >
                        Login
                    </Link>
                    <Link
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        href="/register"
                    >
                        Sign Up
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                <section className="w-full py-16 md:py-28 lg:py-40 xl:py-52 flex items-center justify-center">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-8 text-center">
                            {/* Holiday Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm">
                                <Snowflake className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                                <span className="text-gray-300">Happy Holidays! 🎄</span>
                                <Gift className="w-4 h-4 text-red-400" />
                            </div>

                            {/* Main Heading */}
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                    <span className="text-white">Track Your Impact.</span>
                                    <br />
                                    <span className="text-gradient">Save The Planet.</span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl lg:text-2xl">
                                    Calculate your carbon footprint, compete with friends, and discover eco-friendly alternatives.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg glow-emerald transition-all duration-300 hover:scale-105"
                                    >
                                        <Leaf className="w-5 h-5 mr-2" />
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                                    >
                                        Log In
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-3xl">
                                <div className="glass-card rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-emerald-400">10K+</div>
                                    <div className="text-gray-400 text-sm mt-1">Active Users</div>
                                </div>
                                <div className="glass-card rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-cyan-400">50T</div>
                                    <div className="text-gray-400 text-sm mt-1">CO₂ Tracked</div>
                                </div>
                                <div className="glass-card rounded-xl p-6 text-center">
                                    <div className="text-3xl font-bold text-purple-400">🌍</div>
                                    <div className="text-gray-400 text-sm mt-1">Making Impact</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-6 border-t border-white/10 relative z-10">
                <div className="container px-4 text-center text-gray-500 text-sm">
                    © 2024 EcoTrack. Making the world greener, one step at a time. 🌱
                </div>
            </footer>
        </div>
    );
}

