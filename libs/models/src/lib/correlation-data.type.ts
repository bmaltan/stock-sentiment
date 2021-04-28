export interface CorrelationData {
    [key: string]: {
        close: number;
        day: string;
        total_mention: number;
    }[]
}
