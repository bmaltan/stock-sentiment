// import { Router } from "@angular/router";
// import { auth } from 'firebase/app';
// import { AngularFireAuth } from "@angular/fire/auth";
// import { User } from 'firebase';

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthService {

//     user: firebase.;

//     constructor(
//         private firebaseAuth: AngularFireAuth
//     ) {
//         this.user = firebaseAuth.authState;
//     }

//     signup(email: string, password: string) {
//         this.firebaseAuth
//             .createUserWithEmailAndPassword(email, password)
//             .then(value => {
//                 console.log('Success!', value);
//             })
//             .catch(err => {
//                 console.log('Something went wrong:', err.message);
//             });
//     }
// }
