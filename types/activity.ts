export interface Activity {
    id: string;
    type: string;
    action: string;
    description?: string;
    carbonImpact: number;
    points: number;
    date: Date;
}
