import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';
import type { PlatformData } from '@invest-track/models';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  allPlatformData: PlatformData[] = [];

  constructor(private db: AngularFireDatabase) {}

  getAllPlatformData() {
    this.db
      .object('platforms')
      .snapshotChanges()
      .pipe(
        take(1),
        map((data) => {
          this.allPlatformData = data.payload.val() as PlatformData[];
          console.log(this.allPlatformData);
        })
      )
      .toPromise();
  }
}
