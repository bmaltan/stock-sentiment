import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Platform, PlatformMetadata } from '@invest-track/models';
import { map, take } from 'rxjs/operators';
import type { PlatformDataForDay } from '@invest-track/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlatformService {

    private platformMetadata = new BehaviorSubject<PlatformMetadata[]>([]);

    constructor(
        private db: AngularFireDatabase
    ) { }

    getPlatforms() {
        return platforms;
    }

    getPlatformData(platform: string, date: string): Promise<PlatformDataForDay> {
        return this.db.object('platforms/' + platform + '/' + date).snapshotChanges().pipe(
            take(1),
            map((data) => data.payload.val() as PlatformDataForDay))
            .toPromise();
    }

    getPlatformMetadata() {
        this.db.object('platformMetadata/').snapshotChanges().pipe(
            take(1),
            map((data) => {
                const platformMetadata: PlatformMetadata[] = [];
                const values = data.payload.val() as { [key: string]: { availableDates: string } };
                const keys = Object.keys(values);

                keys.forEach(key => {
                    platformMetadata.push({
                        name: key,
                        availableDates: Object.values(values[key].availableDates)
                            .sort((a: string, b: string): number => (a > b) ? -1 : ((a < b) ? 1 : 0))
                    })
                })
                this.platformMetadata.next(platformMetadata);
            })).toPromise();
    }

    getAllPlatformMetadata(): BehaviorSubject<PlatformMetadata[]> {
        return this.platformMetadata;
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