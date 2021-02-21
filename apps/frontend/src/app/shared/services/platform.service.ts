import { Injectable } from '@angular/core';
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

@Injectable({
    providedIn: 'root',
})
export class PlatformService {
    private platformMetadata = new BehaviorSubject<PlatformMetadata[]>([]);

    constructor(private db: AngularFireDatabase) { }

    getPlatforms() {
        return platforms;
    }

    getPlatformData(
        platform: string,
        date: string
    ): Promise<PlatformDataForDay> {
        const query = 'platforms/' + platform + '/' + date;
        const cachedData = window.sessionStorage.getItem(query);

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
        name: 'r/investing',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-investing',
    },
    {
        name: 'r/wallstreetbets',
        displayName: 'r/wsb',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-wallstreetbets',
    },
    {
        name: 'r/stocks',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-stocks',
    },
    {
        name: 'r/pennystocks',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-pennystocks',
    },
    {
        name: 'r/stockmarket',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-stockmarket',
    },
    {
        name: 'r/stock_picks',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-stock_picks',
    },
    {
        name: 'r/daytrading',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-daytrading',
    },
    {
        name: 'r/robinhoodpennystocks',
        displayName: 'r/RHpenny',
        icon: 'logo-reddit',
        platform: 'reddit',
        route: 'r-robinhoodpennystocks',
    },
    // {
    //     name: 'yahoo',
    //     icon: 'logo-yahoo',
    //     platform: 'yahoo',
    //     route: 'yahoo',
    // },
    // {
    //     name: 'twitter',
    //     icon: 'logo-twitter',
    //     platform: 'twitter',
    //     route: 'twitter',
    // },
];