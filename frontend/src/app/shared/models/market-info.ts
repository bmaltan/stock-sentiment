export interface PlatformData {
    [platformName: string]: {
        [date: string]: {
            topStocks: Stock[];
        }
    }
}

export interface Stock {
    ticker: string;
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