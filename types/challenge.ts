export interface Challenge {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    deadline: Date;
}
