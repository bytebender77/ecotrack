// Daily Quests System
// Rotating daily challenges with bonus rewards

export interface Quest {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: 'count' | 'category' | 'streak' | 'any';
    requirement: {
        target: number;
        category?: string;
        action?: string;
    };
    reward: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

// Quest templates that rotate daily
export const QUEST_TEMPLATES: Quest[] = [
    // Easy Quests
    {
        id: 'log_one',
        title: 'First Step',
        description: 'Log any eco activity today',
        icon: '🎯',
        type: 'count',
        requirement: { target: 1 },
        reward: 5,
        difficulty: 'easy',
    },
    {
        id: 'log_three',
        title: 'Triple Threat',
        description: 'Log 3 activities today',
        icon: '🔥',
        type: 'count',
        requirement: { target: 3 },
        reward: 15,
        difficulty: 'medium',
    },
    {
        id: 'walk_today',
        title: 'Walk It Out',
        description: 'Log a walking or cycling activity',
        icon: '🚶',
        type: 'category',
        requirement: { target: 1, category: 'transport', action: 'walk' },
        reward: 10,
        difficulty: 'easy',
    },
    {
        id: 'veggie_meal',
        title: 'Green Plate',
        description: 'Log a vegetarian or vegan meal',
        icon: '🥗',
        type: 'category',
        requirement: { target: 1, category: 'food', action: 'veg' },
        reward: 10,
        difficulty: 'easy',
    },
    {
        id: 'public_transport',
        title: 'Public Rider',
        description: 'Use public transport today',
        icon: '🚌',
        type: 'category',
        requirement: { target: 1, category: 'transport', action: 'bus' },
        reward: 12,
        difficulty: 'medium',
    },
    {
        id: 'five_activities',
        title: 'Eco Champion',
        description: 'Log 5 activities today',
        icon: '🏆',
        type: 'count',
        requirement: { target: 5 },
        reward: 25,
        difficulty: 'hard',
    },
    {
        id: 'no_car',
        title: 'Car-Free Day',
        description: 'Log transport without using a car',
        icon: '🚗❌',
        type: 'category',
        requirement: { target: 2, category: 'transport', action: 'nocar' },
        reward: 20,
        difficulty: 'medium',
    },
    {
        id: 'green_action',
        title: 'Planet Helper',
        description: 'Complete a green action (recycle, plant, etc.)',
        icon: '🌱',
        type: 'category',
        requirement: { target: 1, category: 'green' },
        reward: 15,
        difficulty: 'medium',
    },
];

// Get today's quests (3 quests that rotate based on day)
export function getTodaysQuests(): Quest[] {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

    // Select 3 quests based on day of year
    const quests: Quest[] = [];
    const shuffled = [...QUEST_TEMPLATES].sort((a, b) => {
        const hashA = (dayOfYear * 31 + a.id.charCodeAt(0)) % 100;
        const hashB = (dayOfYear * 31 + b.id.charCodeAt(0)) % 100;
        return hashA - hashB;
    });

    // Always include an easy, medium, and one random
    const easy = shuffled.find(q => q.difficulty === 'easy');
    const medium = shuffled.find(q => q.difficulty === 'medium');
    const other = shuffled.find(q => q !== easy && q !== medium);

    if (easy) quests.push(easy);
    if (medium) quests.push(medium);
    if (other) quests.push(other);

    return quests.slice(0, 3);
}

// Check quest progress based on today's activities
export function checkQuestProgress(
    quest: Quest,
    activities: { type: string; action: string }[]
): { completed: boolean; progress: number } {
    let matchingCount = 0;

    switch (quest.type) {
        case 'count':
            matchingCount = activities.length;
            break;
        case 'category':
            matchingCount = activities.filter(a => {
                const matchCategory = quest.requirement.category
                    ? a.type.toLowerCase() === quest.requirement.category.toLowerCase()
                    : true;
                const matchAction = quest.requirement.action
                    ? a.action.toLowerCase().includes(quest.requirement.action.toLowerCase())
                    : true;
                return matchCategory && matchAction;
            }).length;
            break;
        case 'any':
            matchingCount = activities.length;
            break;
    }

    const progress = Math.min(100, (matchingCount / quest.requirement.target) * 100);
    const completed = matchingCount >= quest.requirement.target;

    return { completed, progress };
}

export function getDifficultyColor(difficulty: Quest['difficulty']): string {
    switch (difficulty) {
        case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
        case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
        case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    }
}
