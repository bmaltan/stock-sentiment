export interface PlatformData {
    platform: 'reddit' | 'twitter' | 'yahoo';
    name: string;
    date: Date;
    topStocks: Stock[];
}

export interface Stock {
    ticker: string;
    name: string;
    openingPrice: number;
    closingPrice: number;
    dailyChange?: number; // will be calculated in the frontend, don't store
    numOfMentions: number;
    links?: DiscussionLink[];
}

export interface DiscussionLink {
    title: string;
    url: string;
}