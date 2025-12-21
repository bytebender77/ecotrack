// Level/Title System
// Users progress through ranks based on EcoPoints

export interface Level {
    level: number;
    title: string;
    icon: string;
    minPoints: number;
    maxPoints: number | null;
    color: string;
    bgColor: string;
    description: string;
}

export const LEVELS: Level[] = [
    {
        level: 1,
        title: "Seedling",
        icon: "🌱",
        minPoints: 0,
        maxPoints: 99,
        color: "text-lime-600",
        bgColor: "bg-lime-100 dark:bg-lime-900/30",
        description: "Just starting your eco journey!"
    },
    {
        level: 2,
        title: "Sprout",
        icon: "🌿",
        minPoints: 100,
        maxPoints: 499,
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        description: "Growing into sustainability"
    },
    {
        level: 3,
        title: "Green Warrior",
        icon: "⚔️",
        minPoints: 500,
        maxPoints: 999,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        description: "Fighting for the planet!"
    },
    {
        level: 4,
        title: "Eco Champion",
        icon: "🏆",
        minPoints: 1000,
        maxPoints: 2499,
        color: "text-teal-600",
        bgColor: "bg-teal-100 dark:bg-teal-900/30",
        description: "A true environmental champion"
    },
    {
        level: 5,
        title: "Planet Guardian",
        icon: "🌍",
        minPoints: 2500,
        maxPoints: 4999,
        color: "text-cyan-600",
        bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
        description: "Guardian of Earth"
    },
    {
        level: 6,
        title: "Eco Master",
        icon: "🧙",
        minPoints: 5000,
        maxPoints: 9999,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        description: "Master of sustainability"
    },
    {
        level: 7,
        title: "Climate Hero",
        icon: "🦸",
        minPoints: 10000,
        maxPoints: 24999,
        color: "text-indigo-600",
        bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
        description: "Superhero of climate action"
    },
    {
        level: 8,
        title: "Eco Legend",
        icon: "👑",
        minPoints: 25000,
        maxPoints: null,
        color: "text-purple-600",
        bgColor: "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
        description: "Legendary environmental impact!"
    },
];

export function getCurrentLevel(ecoScore: number): Level {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (ecoScore >= LEVELS[i].minPoints) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

export function getNextLevel(ecoScore: number): Level | null {
    const currentLevel = getCurrentLevel(ecoScore);
    const nextIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
    return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
}

export function getLevelProgress(ecoScore: number): number {
    const current = getCurrentLevel(ecoScore);
    const next = getNextLevel(ecoScore);

    if (!next) return 100; // Max level

    const pointsInLevel = ecoScore - current.minPoints;
    const totalPointsNeeded = next.minPoints - current.minPoints;

    return Math.min(100, (pointsInLevel / totalPointsNeeded) * 100);
}

export function getPointsToNextLevel(ecoScore: number): number {
    const next = getNextLevel(ecoScore);
    if (!next) return 0;
    return next.minPoints - ecoScore;
}
