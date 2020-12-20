import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    allPlatformData: any[] = [];

    constructor(
        private db: AngularFireDatabase
    ) { }

    getAllPlatformData() {
        this.db.object('platforms').snapshotChanges()
            .pipe(
                take(1),
                map(data => {
                    this.allPlatformData = data.payload.val() as any[];
                    console.log(this.allPlatformData)
                })
            )
            .toPromise();
    }
}