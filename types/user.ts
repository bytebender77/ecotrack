export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    city?: string;
    country?: string;
    ecoScore: number;
    totalSaved: number;
    streakCurrent: number;
    streakLongest: number;
    lastActivity: Date | null;
    notifications: boolean;
    publicProfile: boolean;
    createdAt: Date;
    updatedAt: Date;
}
