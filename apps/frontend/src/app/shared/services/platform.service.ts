import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Platform, PlatformMetadata } from '@invest-track/models';
import { map, take } from 'rxjs/operators';
import type {
    DiscussionLinkShort,
    DiscussionLink,
    PlatformDataForDay,
    PlatformDataForDayShort,
    Stock,
    StockShort,
} from '@invest-track/models';
import { BehaviorSubject, of } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class PlatformService {
    private platformMetadata = new BehaviorSubject<PlatformMetadata[]>([]);

    constructor(
        private db: AngularFireDatabase,
        @Inject(PLATFORM_ID) private platformId: string
    ) { }

    getPlatforms() {
        return platforms;
    }

    getPlatformData(
        platform: string,
        date: string
    ): Promise<PlatformDataForDay> {
        const query = 'platforms/' + platform + '/' + date;
        const cachedData = !isPlatformServer(this.platformId) ? window.sessionStorage.getItem(query) : null;

        if (cachedData) {
            return of(JSON.parse(cachedData)).toPromise();
        } else {
            return this.db
                .object(query)
                .snapshotChanges()
                .pipe(
                    take(1),
                    map((data) => {
                        const dbValues = data.payload.val() as PlatformDataForDayShort;
                        const converted = this.convertToFrontendModel(
                            platform,
                            dbValues
                        );
                        window.sessionStorage.setItem(
                            query,
                            JSON.stringify(converted)
                        );

                        return converted;
                    })
                )
                .toPromise();
        }
    }

    getPlatformMetadata() {
        this.db
            .object('platformMetadata/')
            .snapshotChanges()
            .pipe(
                take(1),
                map((data) => {
                    const platformMetadata: PlatformMetadata[] = [];
                    const values = data.payload.val() as {
                        [key: string]: { availableDates: string };
                    };
                    const keys = Object.keys(values);

                    keys.forEach((key) => {
                        platformMetadata.push({
                            name: key,
                            availableDates: Object.values(
                                values[key].availableDates
                            ).sort((a: string, b: string): number =>
                                a > b ? -1 : a < b ? 1 : 0
                            ),
                        });
                    });
                    this.platformMetadata.next(platformMetadata);
                })
            )
            .toPromise();
    }

    getAllPlatformMetadata(): BehaviorSubject<PlatformMetadata[]> {
        return this.platformMetadata;
    }

    private convertToFrontendModel(
        platform: string,
        data: PlatformDataForDayShort
    ): PlatformDataForDay {
        return {
            topStocks: [
                ...Object.entries(data.topStocks).map(
                    ([tickerName, ticker]: [string, StockShort]) =>
                    ({
                        ticker: tickerName,
                        closingPrice: ticker.c,
                        openingPrice: ticker.o,
                        numOfMentions: ticker.nm,
                        numOfPosts: ticker.np,
                        links: ticker.l?.map(
                            (link: DiscussionLinkShort) =>
                            ({
                                awards: link.a,
                                score: link.s,
                                url: this.getLinkForPlatform(
                                    platform,
                                    link.u
                                ),
                                title: link.t,
                            } as DiscussionLink)
                        ),
                    } as Stock)
                ),
            ],
        } as PlatformDataForDay;
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
        category: "Reddit, Stocks",
        icon: 'logo-reddit',
        source: 'reddit',
        platforms: [
            {
                name: 'r/investing',
                route: 'r-investing',
            },
            {
                name: 'r/wallstreetbets',
                displayName: 'r/wsb',
                route: 'r-wallstreetbets',
            },
            {
                name: 'r/stocks',
                route: 'r-stocks',
            },
            {
                name: 'r/pennystocks',
                route: 'r-pennystocks',
            },
            {
                name: 'r/stockmarket',
                route: 'r-stockmarket',
            },
            {
                name: 'r/stock_picks',
                route: 'r-stock_picks',
            },
            {
                name: 'r/daytrading',
                route: 'r-daytrading',
            },
            {
                name: 'r/robinhoodpennystocks',
                displayName: 'r/RHpenny',
                route: 'r-robinhoodpennystocks',
            }
        ]
    },
    {
        category: "Reddit, Cryptocurrencies",
        icon: 'logo-reddit',
        source: 'reddit',
        platforms: [
            {
                name: 'r/cryptocurrency',
                route: 'r-cryptocurrency',
            },
            {
                name: 'r/cryptomarkets',
                route: 'r-cryptomarkets',
            },
            {
                name: 'r/crypto_currency_news',
                route: 'r-crypto_currency_news',
            },
            {
                name: 'r/cryptocurrencies',
                route: 'r-cryptocurrencies',
            },
        ]
    }
];