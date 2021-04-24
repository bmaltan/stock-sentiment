import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import type {
    ApiDiscussionLink,
    DiscussionLink,
    PlatformData,
    ApiPlatformData,
    Platform,
    PlatformCategory,
} from '@invest-track/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PlatformService {
    constructor(private httpClient: HttpClient) {}

    getPlatformCategories() {
        return platformCategories;
    }

    getPlatformData(platform: string, date: string): Promise<PlatformData[]> {
        return this.httpClient
            .get<{ data: ApiPlatformData[] }>(
                `api/platforms/${platform}/${date}`
            )
            .pipe(
                map((result: { data: ApiPlatformData[] }) => result.data),
                map((data: ApiPlatformData[]) =>
                    data.map(
                        (tickerData: ApiPlatformData) =>
                            ({
                                platform: tickerData.platform,
                                ticker: tickerData.ticker,
                                day: tickerData.day,
                                open: tickerData.open,
                                close: tickerData.close,
                                numOfPosts: tickerData.num_of_posts,
                                bullMention: tickerData.bull_mention,
                                neutralMention: tickerData.neutral_mention,
                                bearMention: tickerData.bear_mention,
                                links: tickerData.links.map(
                                    (link: ApiDiscussionLink) =>
                                        ({
                                            score: link.score,
                                            awards: link.awards,
                                            title: link.title,
                                            url: this.getLinkForPlatform(
                                                platform,
                                                link.id
                                            ),
                                        } as DiscussionLink)
                                ),
                            } as PlatformData)
                    )
                )
            )
            .toPromise();
    }

    getAvailableDates(platformRoute: string): Promise<string[]> {
        return this.httpClient
            .get<{ data: string[] }>(
                `api/platforms/${platformRoute}/availableDates`
            )
            .pipe(
                map((result: { data: string[] }) => {
                    const data = result.data;
                    return data.sort((a: string, b: string): number =>
                        a > b ? -1 : a < b ? 1 : 0
                    );
                })
            )
            .toPromise();
    }

    getPlatforms(): Platform[] {
        return platformCategories.reduce((acc, current) => {
            const result: Platform[] = [];
            result.push(...current.platforms);
            return result;
        }, [] as Platform[]);
    }

    private getLinkForPlatform(platform: string, link: string): string {
        if (link.startsWith('http')) return link;

        if (platform.startsWith('r-')) {
            const sub = platform.replace('r-', '');
            return `https://www.reddit.com/r/${sub}/comments/${link}/`;
        }

        return link;
    }
}

const platformCategories: PlatformCategory[] = [
    {
        category: 'Reddit, Stocks',
        icon: 'logo-reddit',
        source: 'reddit',
        platforms: [
            {
                name: 'r/investing',
                displayName: 'r/investing',
                route: 'r-investing',
            },
            {
                name: 'r/wallstreetbets',
                displayName: 'r/wallstreetbets',
                route: 'r-wsb',
            },
            {
                name: 'r/stocks',
                displayName: 'r/stocks',
                route: 'r-stocks',
            },
            {
                name: 'r/pennystocks',
                displayName: 'r/pennystocks',
                route: 'r-pennystocks',
            },
            {
                name: 'r/stockmarket',
                displayName: 'r/stockmarket',
                route: 'r-stockmarket',
            },
            {
                name: 'r/stock_picks',
                displayName: 'r/stock_picks',
                route: 'r-stock_picks',
            },
            {
                name: 'r/daytrading',
                displayName: 'r/daytrading',
                route: 'r-daytrading',
            },
            {
                name: 'r/RobinHoodpennystocks',
                displayName: 'r/RHpenny',
                route: 'r-RHpennystocks',
            },
        ],
    },
    {
        category: 'Reddit, Cryptocurrencies',
        icon: 'logo-reddit',
        source: 'reddit',
        platforms: [
            {
                name: 'r/cryptocurrency',
                displayName: 'r/cryptocurrency',
                route: 'r-cryptocurrency',
            },
            {
                name: 'r/cryptomarkets',
                displayName: 'r/cryptomarkets',
                route: 'r-cryptomarkets',
            },
            {
                name: 'r/crypto_currency_news',
                displayName: 'r/crypto_currency_news',
                route: 'r-crypto_currency_news',
            },
            {
                name: 'r/cryptocurrencies',
                displayName: 'r/cryptocurrencies',
                route: 'r-cryptocurrencies',
            },
        ],
    },
];
