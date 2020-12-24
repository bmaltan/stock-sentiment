import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';
import type { PlatformData } from '@invest-track/models';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    _allPlatformData: PlatformData[] = [];

    constructor(
        private db: AngularFireDatabase
    ) { }

    // fetchAllPlatformData() {
    //     this.db.object('platforms').snapshotChanges().pipe(
    //         take(1),
    //         map((data) => {
    //             this._allPlatformData = data.payload.val() as PlatformData[];
    //         }))
    //         .toPromise();
    // }

    get allPlatformData() {
        return this._allPlatformData;
    }

    getPlatformData(platform: string, latest = true, date?: string): Promise<PlatformData> {
        if (latest) {

        } else {

        }
        return this.db.object('platforms/' + platform).snapshotChanges().pipe(
            take(1),
            map((data) => data.payload.val() as PlatformData))
            .toPromise();
    }
}
