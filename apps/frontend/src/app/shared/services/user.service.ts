import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
import firebase from "firebase";
import { ReplaySubject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AngularFireDatabase } from "@angular/fire/database";
import { last, map, take } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private user: ReplaySubject<firebase.User> = new ReplaySubject(1);
    private favorites: ReplaySubject<string[]> = new ReplaySubject(1);

    constructor(
        private firebaseAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private snackbar: MatSnackBar
    ) {
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                this.user.next(user as firebase.User);
                this.getFavorites(user.uid);
            }
        })

        firebaseAuth.setPersistence('local');
    }

    getCurrentUser() {
        return this.user;
    }

    signup(email: string, password: string): Promise<firebase.auth.UserCredential | undefined> {
        return this.firebaseAuth
            .createUserWithEmailAndPassword(email, password)
            .then(value => {
                this.user.next(value.user as firebase.User);
                return value;
            })
            .catch(err => {
                this.snackbar.open(err.message, undefined, { duration: 4000 });
                return err.message;
            });
    }

    login(email: string, password: string): Promise<firebase.auth.UserCredential | undefined> {
        return this.firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(value => {
                this.user.next(value.user as firebase.User);
                return value;
            })
            .catch(err => {
                this.snackbar.open(err.message, undefined, { duration: 4000 });
                return err.message;
            });
    }

    logout() {
        this.firebaseAuth.signOut();
    }

    private getFavorites(userId: string): void {
        this.db.object(`userPreferences/${userId}/favorites/`).snapshotChanges().pipe(
            take(1),
            map((data) => {
                if (data?.payload?.val()) {
                    this.favorites.next((data.payload.val() as any));
                } else {
                    this.favorites.next([]);
                }
            }))
            .toPromise();
    }

    getUserFavorites() {
        return this.favorites;
    }

    toggleFavorite(platform: string): void {
        let updatedFavorites: string[] = [];

        this.favorites.subscribe((favorites: string[]) => {
            updatedFavorites = [...favorites];

            const index = updatedFavorites.findIndex(fav => fav === platform);
            if (index > -1) {
                updatedFavorites.splice(index, 1);
            }
            else {
                updatedFavorites.push(platform);
            }
        });

        this.user.subscribe(user => {
            this.db.object(`userPreferences/${user.uid}/favorites/`).set(updatedFavorites);
        });

        this.favorites.next(updatedFavorites)
    }
}
