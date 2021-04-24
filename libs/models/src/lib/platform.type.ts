export interface PlatformCategory {
    category: string;
    icon: string;
    source: string;

    platforms: Platform[];
}

export interface Platform {
    name: string;
    displayName: string;
    route: string;
}
