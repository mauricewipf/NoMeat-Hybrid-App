import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Day } from './classes/day';
import { Calendar } from './classes/calendar';

@Injectable()
export class FireStoreService {

  daysRef: AngularFirestoreCollection<any[]>;
  calendarsRef: AngularFirestoreCollection<any[]>;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private afs: AngularFirestore,
  ) {
    this.daysRef = db.collection('days');
    this.calendarsRef = db.collection('calendars');
  }

  getDays(): Observable<Day[]> {
    return this.afs.collection<Day>(
      'days',
      ref => ref.where('user_uid', '==', this.authService.userObj.uid)
    ).snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Day;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getCalendars(): Observable<Calendar[]> {
    return this.afs.collection<Calendar>(
      'calendars',
      ref => ref.where('user_uid', '==', this.authService.userObj.uid)
    ).snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Calendar;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    });
  }
}
