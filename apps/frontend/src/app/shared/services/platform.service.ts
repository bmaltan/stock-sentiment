import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import type {
    DiscussionLink,
    PlatformData,
    ApiPlatformData,
    Platform,
} from '@invest-track/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PlatformService {
    constructor(private httpClient: HttpClient) {}

    getPlatforms() {
        return platforms;
    }

    getPlatformData(platform: string, date: string): Promise<PlatformData[]> {
        return this.httpClient
            .get<{ data: ApiPlatformData[] }>(
                `api/platforms/${platform}/${date}`
            )
            .pipe(
                map((result) => result.data),
                map((data) =>
                    data.map(
                        (tickerData) =>
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
                                    (link) =>
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

    getAvailableDates(platform: string): Promise<string[]> {
        return this.httpClient
            .get<{ data: string[] }>(`api/platforms/${platform}/availableDates`)
            .pipe(
                map((result) => {
                    const data = result.data;
                    return data.sort((a: string, b: string): number =>
                        a > b ? -1 : a < b ? 1 : 0
                    );
                })
            )
            .toPromise();
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

const platforms: Platform[] = [
    {
        category: 'Reddit, Stocks',
        icon: 'logo-reddit',
        source: 'reddit',
        platforms: [
            {
                displayName: 'r/investing',
                route: 'r-investing',
            },
            {
                displayName: 'r/wsb',
                route: 'r-wsb',
            },
            {
                displayName: 'r/stocks',
                route: 'r-stocks',
            },
            {
                displayName: 'r/pennystocks',
                route: 'r-pennystocks',
            },
            {
                displayName: 'r/stockmarket',
                route: 'r-stockmarket',
            },
            {
                displayName: 'r/stock_picks',
                route: 'r-stock_picks',
            },
            {
                displayName: 'r/daytrading',
                route: 'r-daytrading',
            },
            {
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
                displayName: 'r/cryptocurrency',
                route: 'r-cryptocurrency',
            },
            {
                displayName: 'r/cryptomarkets',
                route: 'r-cryptomarkets',
            },
            {
                displayName: 'r/crypto_currency_news',
                route: 'r-crypto_currency_news',
            },
            {
                displayName: 'r/cryptocurrencies',
                route: 'r-cryptocurrencies',
            },
        ],
    },
];
