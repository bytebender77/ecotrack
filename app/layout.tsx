import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import MusicPlayer from "@/components/common/MusicPlayer";
import SnowfallEffect from "@/components/common/SnowfallEffect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EcoTrack",
    description: "Track your carbon footprint and make a difference.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <SnowfallEffect />
                        {children}
                        <Toaster />
                        <MusicPlayer />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

