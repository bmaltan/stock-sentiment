import type {
    DiscussionLink,
    DiscussionLinkShort,
} from './discussion-link.type';

export interface Stock {
    ticker: string;
    openingPrice: number;
    closingPrice: number;
    dailyChange?: number; // will be calculated in the frontend, don't store
    numOfMentions: number;
    numOfPosts: number;
    links?: DiscussionLink[];
}

export interface StockShort {
    o: number;
    c: number;
    nm: number;
    np: number;
    t: string;
    l: DiscussionLinkShort[];
}
