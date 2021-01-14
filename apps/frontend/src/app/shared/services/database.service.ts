import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';
import type { PlatformData } from '@invest-track/models';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {

    constructor(
        private db: AngularFireDatabase
    ) { }

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
