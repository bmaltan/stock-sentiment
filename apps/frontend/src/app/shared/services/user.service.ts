import { AngularFireAuth } from '@angular/fire/auth';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import firebase from 'firebase';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private user = new BehaviorSubject<firebase.User | undefined>(undefined);
    private favorites: ReplaySubject<string[]> = new ReplaySubject(1);

    constructor(
        private firebaseAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private snackbar: MatSnackBar,
        @Inject(PLATFORM_ID) private platformId: string
    ) {
        firebaseAuth.onAuthStateChanged((user) => {
            if (user) {
                this.user.next(user as firebase.User);
                this.getFavorites(user.uid);
            }
        });

        if (!isPlatformServer(this.platformId)) {
            firebaseAuth.setPersistence('local');
        }
    }

    getCurrentUser() {
        return this.user;
    }

    async signup(
        email: string,
        password: string
    ): Promise<firebase.auth.UserCredential | undefined> {
        try {
            const value = await this.firebaseAuth.createUserWithEmailAndPassword(
                email,
                password
            );
            this.user.next(value.user as firebase.User);
            this.snackbar.open('Welcome to Stock Sentiment!', undefined, {
                duration: 4000,
            });
            return value;
        } catch (err) {
            this.snackbar.open(err.message, undefined, { duration: 4000 });
            return err.message;
        }
    }

    async login(
        email: string,
        password: string
    ): Promise<firebase.auth.UserCredential | undefined> {
        try {
            const value = await this.firebaseAuth.signInWithEmailAndPassword(
                email,
                password
            );
            this.user.next(value.user as firebase.User);
            this.snackbar.open('Welcome back!', undefined, {
                duration: 400000,
            });
            return value;
        } catch (err) {
            this.snackbar.open(err.message, undefined, { duration: 4000 });
            return err.message;
        }
    }

    logout() {
        this.firebaseAuth.signOut();
        setTimeout(() => {
            this.user.next(undefined);
        }, 200); // to offset the mat fade-out duration for the menu
    }

    private getFavorites(userId: string): void {
        this.db
            .object(`userPreferences/${userId}/favoritePlatforms/`)
            .snapshotChanges()
            .pipe(
                take(1),
                map((data) => {
                    if (data?.payload?.val()) {
                        this.favorites.next(data.payload.val() as string[]);
                    } else {
                        this.favorites.next([]);
                    }
                })
            )
            .toPromise();
    }

    getUserFavoritePlatforms() {
        return this.favorites;
    }

    toggleFavorite(platform: string): void {
        let updatedFavorites: string[] = [];

        this.favorites.subscribe((favorites: string[]) => {
            updatedFavorites = [...favorites];

            const index = updatedFavorites.findIndex((fav) => fav === platform);
            if (index > -1) {
                updatedFavorites.splice(index, 1);
            } else {
                updatedFavorites.push(platform);
            }
        });

        this.user.subscribe((user) => {
            if (user)
                this.db
                    .object(`userPreferences/${user.uid}/favoritePlatforms/`)
                    .set(updatedFavorites);
        });

        this.favorites.next(updatedFavorites);
    }
}
