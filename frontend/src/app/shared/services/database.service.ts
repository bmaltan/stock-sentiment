import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(
        private db: AngularFireDatabase
    ) { }

    getAllPlatformData() {
        return this.db.object('platforms').snapshotChanges()
            .pipe(
                take(1),
                map(data => data.payload.val())
            )
            .toPromise();
    }
}