export interface Platform {
    category: string;
    icon: string;
    source: string;

    platforms: Array<{
        displayName: string;
        route: string;
    }>;
}
