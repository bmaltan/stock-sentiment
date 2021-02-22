export interface Platform {
    category: string;
    icon: string;
    source: string;

    platforms: {
        name: string;
        displayName?: string;
        route: string;
    }[];
}