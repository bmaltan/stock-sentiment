export interface Platform {
    category: string;
    icon: string;
    source: string;

    platforms: Array<{
        name: string;
        displayName: string;
        route: string;
    }>;
}
