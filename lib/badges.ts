// Achievement Badges System
// Milestone-based unlocks for user engagement

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    requirement: {
        type: 'ecoScore' | 'carbonAvoided' | 'streak' | 'activities' | 'challenges';
        value: number;
    };
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    category: 'milestone' | 'streak' | 'impact' | 'social';
}

export const BADGES: Badge[] = [
    // Milestone Badges - EcoScore
    {
        id: 'first_leaf',
        name: 'First Leaf',
        icon: '🌱',
        description: 'Log your first eco activity',
        requirement: { type: 'ecoScore', value: 1 },
        tier: 'bronze',
        category: 'milestone',
    },
    {
        id: 'green_starter',
        name: 'Green Starter',
        icon: '🌿',
        description: 'Reach 100 EcoPoints',
        requirement: { type: 'ecoScore', value: 100 },
        tier: 'bronze',
        category: 'milestone',
    },
    {
        id: 'eco_warrior',
        name: 'Eco Warrior',
        icon: '⚔️',
        description: 'Reach 500 EcoPoints',
        requirement: { type: 'ecoScore', value: 500 },
        tier: 'silver',
        category: 'milestone',
    },
    {
        id: 'planet_champion',
        name: 'Planet Champion',
        icon: '🏆',
        description: 'Reach 1000 EcoPoints',
        requirement: { type: 'ecoScore', value: 1000 },
        tier: 'gold',
        category: 'milestone',
    },
    {
        id: 'eco_legend',
        name: 'Eco Legend',
        icon: '👑',
        description: 'Reach 5000 EcoPoints',
        requirement: { type: 'ecoScore', value: 5000 },
        tier: 'platinum',
        category: 'milestone',
    },

    // Impact Badges - Carbon Avoided
    {
        id: 'carbon_saver',
        name: 'Carbon Saver',
        icon: '💨',
        description: 'Avoid 10kg of CO₂ emissions',
        requirement: { type: 'carbonAvoided', value: 10 },
        tier: 'bronze',
        category: 'impact',
    },
    {
        id: 'tree_hugger',
        name: 'Tree Hugger',
        icon: '🌳',
        description: 'Avoid 50kg of CO₂ (like 2+ trees!)',
        requirement: { type: 'carbonAvoided', value: 50 },
        tier: 'silver',
        category: 'impact',
    },
    {
        id: 'forest_guardian',
        name: 'Forest Guardian',
        icon: '🌲',
        description: 'Avoid 100kg of CO₂',
        requirement: { type: 'carbonAvoided', value: 100 },
        tier: 'gold',
        category: 'impact',
    },
    {
        id: 'planet_protector',
        name: 'Planet Protector',
        icon: '🌍',
        description: 'Avoid 500kg of CO₂',
        requirement: { type: 'carbonAvoided', value: 500 },
        tier: 'platinum',
        category: 'impact',
    },

    // Streak Badges
    {
        id: 'consistent',
        name: 'Consistent',
        icon: '🔥',
        description: 'Maintain a 3-day streak',
        requirement: { type: 'streak', value: 3 },
        tier: 'bronze',
        category: 'streak',
    },
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        icon: '📅',
        description: 'Maintain a 7-day streak',
        requirement: { type: 'streak', value: 7 },
        tier: 'silver',
        category: 'streak',
    },
    {
        id: 'month_master',
        name: 'Month Master',
        icon: '🌙',
        description: 'Maintain a 30-day streak',
        requirement: { type: 'streak', value: 30 },
        tier: 'gold',
        category: 'streak',
    },
    {
        id: 'streak_legend',
        name: 'Streak Legend',
        icon: '⭐',
        description: 'Maintain a 100-day streak',
        requirement: { type: 'streak', value: 100 },
        tier: 'platinum',
        category: 'streak',
    },

    // Challenge Badges
    {
        id: 'challenger',
        name: 'Challenger',
        icon: '🎯',
        description: 'Complete your first challenge',
        requirement: { type: 'challenges', value: 1 },
        tier: 'bronze',
        category: 'social',
    },
    {
        id: 'challenge_hunter',
        name: 'Challenge Hunter',
        icon: '🏹',
        description: 'Complete 5 challenges',
        requirement: { type: 'challenges', value: 5 },
        tier: 'silver',
        category: 'social',
    },
    {
        id: 'challenge_master',
        name: 'Challenge Master',
        icon: '🎖️',
        description: 'Complete 10 challenges',
        requirement: { type: 'challenges', value: 10 },
        tier: 'gold',
        category: 'social',
    },
];

interface UserStats {
    ecoScore: number;
    carbonAvoided: number;
    streakCurrent: number;
    streakLongest: number;
    completedChallenges?: number;
}

export function getUnlockedBadges(stats: UserStats): Badge[] {
    return BADGES.filter(badge => {
        switch (badge.requirement.type) {
            case 'ecoScore':
                return stats.ecoScore >= badge.requirement.value;
            case 'carbonAvoided':
                return stats.carbonAvoided >= badge.requirement.value;
            case 'streak':
                return Math.max(stats.streakCurrent, stats.streakLongest) >= badge.requirement.value;
            case 'challenges':
                return (stats.completedChallenges || 0) >= badge.requirement.value;
            default:
                return false;
        }
    });
}

export function getNextBadges(stats: UserStats, limit = 3): { badge: Badge; progress: number }[] {
    const locked = BADGES.filter(badge => {
        switch (badge.requirement.type) {
            case 'ecoScore':
                return stats.ecoScore < badge.requirement.value;
            case 'carbonAvoided':
                return stats.carbonAvoided < badge.requirement.value;
            case 'streak':
                return Math.max(stats.streakCurrent, stats.streakLongest) < badge.requirement.value;
            case 'challenges':
                return (stats.completedChallenges || 0) < badge.requirement.value;
            default:
                return true;
        }
    });

    return locked.slice(0, limit).map(badge => {
        let current = 0;
        switch (badge.requirement.type) {
            case 'ecoScore':
                current = stats.ecoScore;
                break;
            case 'carbonAvoided':
                current = stats.carbonAvoided;
                break;
            case 'streak':
                current = Math.max(stats.streakCurrent, stats.streakLongest);
                break;
            case 'challenges':
                current = stats.completedChallenges || 0;
                break;
        }
        return {
            badge,
            progress: Math.min(100, (current / badge.requirement.value) * 100),
        };
    });
}

export function getTierColor(tier: Badge['tier']): string {
    switch (tier) {
        case 'bronze': return 'from-amber-600 to-orange-700';
        case 'silver': return 'from-gray-300 to-gray-500';
        case 'gold': return 'from-yellow-400 to-amber-500';
        case 'platinum': return 'from-cyan-300 to-blue-500';
    }
}

export function getTierBorder(tier: Badge['tier']): string {
    switch (tier) {
        case 'bronze': return 'border-amber-600';
        case 'silver': return 'border-gray-400';
        case 'gold': return 'border-yellow-500';
        case 'platinum': return 'border-cyan-400';
    }
}
