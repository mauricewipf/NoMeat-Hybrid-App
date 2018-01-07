import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { User } from './classes/user';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: Observable<User>;
  usersRef: AngularFirestoreCollection<User>;
  userObj: any;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.user = firebaseAuth.authState;
    this.user.subscribe(user => {
      this.userObj = user;
    });
    firebase.auth().useDeviceLanguage();
    this.usersRef = this.afs.collection<User>('users');
  }

  getUserFromCollection(userUid) {
    return this.afs.doc(`users/${userUid}`)
      .snapshotChanges().map(action => {
        const data = action.payload.data() as User;
        const id = action.payload.id;
        return { id, ...data };
      });
  }

  getUsers(): Observable<User[]> {
    return this.usersRef
      .snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as User;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  signup(email: string, password: string) {
    this.firebaseAuth
    .auth
    .createUserWithEmailAndPassword(email, password)
    .then(_ => {
      this.addUserToCollection(firebase.auth().currentUser);
    })
    .catch(err => alert(err.message));
  }

  addUserToCollection(user) {
    this.afs.doc(`users/${user.uid}`).set({
      email: user.email,
      uid: user.uid
    })
    .then()
    .catch(err => alert(err.message));
  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut()
      .then(_ => {
        // this.router.navigate(['/']);
      })
      .catch(err => alert(err.message));
  }

  updatePassword(oldPassword, newPassword) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(this.userObj.email, oldPassword)
      .then(() => {
        return firebase.auth().currentUser.updatePassword(newPassword).then(() => {
          return `Passwort erfolgreich geändert`;
        })
        .catch(error => {
          return `Error: ${error.message}.`;
        });
      })
      .catch(error => {
        return `Error: ${error.message}.`;
      });
  }

  resetPassword(email: string) {
    console.log(`Reset password for ${email}.`);
    return this.firebaseAuth
      .auth.sendPasswordResetEmail(email)
      .then(_ => {
        return `Ihr Passwort wurde zurückgesetzt. Wenden Sie sich bitte an den Administrator, um das neue Passwort zu erhalten.`;
      })
      .catch(err => {
        return `${err.message}`;
      });
  }

  deleteAccount() {
    const currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    firebase.auth().currentUser
    .delete()
    .then(_ => {
      this.deleteUserFromCollection(currentUser.uid);
      alert(`Benutzer gelöscht.`);
      // logs out automatically
    })
    .catch(err => alert(err));
  }

  deleteUserFromCollection(userUid): void {
    this.usersRef.doc(userUid).delete()
    .then(_ => {
      console.log(`User ${userUid} deleted`);
    })
    .catch(err => alert(err));
  }

}
