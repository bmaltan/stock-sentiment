export interface Ticker {
    name: string;
    symbol: string;
}

export interface Link {
    title: string;
    url: string;
    score: number;
}

export class TickerData {
    ticker: string;
    openingPrice: number;
    closingPrice: number;
    numOfMentions: number;
    numOfPosts: number;
    links: Link[];

    constructor(ticker: string) {
        this.closingPrice = undefined;
        this.openingPrice = undefined;
        this.links = [];
        this.numOfPosts = 0;
        this.numOfMentions = 0;
        this.ticker = ticker;
    }
}
