"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarWithModalProps {
    src: string | null | undefined;
    name: string;
    className?: string;
    fallbackClassName?: string;
}

export default function AvatarWithModal({ src, name, className, fallbackClassName }: AvatarWithModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const initial = name?.[0]?.toUpperCase() || 'U';

    return (
        <>
            <Avatar
                className={cn("cursor-pointer hover:ring-4 hover:ring-emerald-200 dark:hover:ring-emerald-800 transition-all", className)}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
            >
                <AvatarImage src={src || undefined} />
                <AvatarFallback className={cn("bg-gradient-to-br from-emerald-400 to-green-500 text-white font-bold", fallbackClassName)}>
                    {initial}
                </AvatarFallback>
            </Avatar>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
                    <DialogContent className="max-w-lg p-0 border-none bg-transparent shadow-none">
                        <div className="relative flex flex-col items-center">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Full Size Image */}
                            {src ? (
                                <img
                                    src={src}
                                    alt={name}
                                    className="w-80 h-80 rounded-full object-cover ring-4 ring-white/20 shadow-2xl"
                                />
                            ) : (
                                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center ring-4 ring-white/20 shadow-2xl">
                                    <span className="text-8xl text-white font-bold">{initial}</span>
                                </div>
                            )}

                            {/* Name */}
                            <h3 className="mt-4 text-xl font-bold text-white">{name}</h3>
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    );
}
