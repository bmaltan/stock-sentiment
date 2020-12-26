import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
import firebase from "firebase";
import { ReplaySubject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private user: ReplaySubject<firebase.User> = new ReplaySubject(1);

    constructor(
        private firebaseAuth: AngularFireAuth,
        private snackbar: MatSnackBar
    ) {
        firebaseAuth.onAuthStateChanged(user => {
            this.user.next(user as firebase.User);
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
                this.snackbar.open(err.message, undefined, { duration: 400000 });
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
}
