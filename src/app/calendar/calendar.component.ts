import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { FireStoreService } from '../firestore.service';

@Component({
    selector: 'ion-calendar',
    templateUrl: './calendar.component.html'
})

export class CalendarComponent implements OnInit {
  @Output() onDaySelect = new EventEmitter<dateObj>();
  currentYear: number;
  currentMonth: number;
  currentDate: number;
  currentDay: number;
  displayYear: number;
  displayMonth: number;
  dateArray: Array<dateObj> = [];
  weekArray = [];
  lastSelect: number = 0;
  weekHead: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  daysRef: AngularFirestoreCollection<any[]>;
  days;

  constructor(
    private db: AngularFirestore
  ) {
    this.daysRef = db.collection('days');

    this.currentYear = moment().year();
    this.currentMonth = moment().month();
    this.currentDate = moment().date();
    this.currentDay = moment().day();
  }

  ngOnInit() {
    this.daysRef.valueChanges().subscribe(days => {
      this.days = days;
      this.today()
    });
  }

  today() {
    this.displayYear = this.currentYear;
    this.displayMonth = this.currentMonth;
    this.createMonth(this.currentYear, this.currentMonth);

    let todayIndex = _.findIndex(this.dateArray, {
      year: this.currentYear,
      month: this.currentMonth,
      date: this.currentDate,
      isThisMonth: true
    })
    this.lastSelect = todayIndex;
    this.dateArray[todayIndex].isSelect = true;
    this.onDaySelect.emit(this.dateArray[todayIndex]);
  }

  createMonth(year: number, month: number) {
    this.dateArray = [];
    this.weekArray = [];
    let firstDay;
    let preMonthDays;
    let monthDays;
    let weekDays: Array<dateObj> = [];

    firstDay = moment({ year: year, month: month, date: 1 }).day();
    if (month === 0) {
      preMonthDays = moment({ year: year - 1, month: 11 }).daysInMonth();
    } else {
      preMonthDays = moment({ year: year, month: month - 1 }).daysInMonth();
    }
    monthDays = moment({ year: year, month: month }).daysInMonth();

    if (firstDay !== 7) {
      let lastMonthStart = preMonthDays - firstDay + 1;
      for (let i = 0; i < firstDay; i++) {
        if (month === 0) {
          this.dateArray.push({
            year: year,
            month: 11,
            date: lastMonthStart + i,
            isThisMonth: false,
            isToday: false,
            isSelect: false,
            isHighlighted: this.highlightDay(year, 11, lastMonthStart + i)
          })
        } else {
          this.dateArray.push({
            year: year,
            month: month - 1,
            date: lastMonthStart + i,
            isThisMonth: false,
            isToday: false,
            isSelect: false,
            isHighlighted: this.highlightDay(year, month-1, i+1)
          })
        }
      }
    }

    for (let i = 0; i < monthDays; i++) {
      this.dateArray.push({
        year: year,
        month: month,
        date: i + 1,
        isThisMonth: true,
        isToday: false,
        isSelect: false,
        isHighlighted: this.highlightDay(year, month, i+1)
      })
    }

    if (this.currentYear === year && this.currentMonth === month) {
      let todayIndex = _.findIndex(this.dateArray, {
        year: this.currentYear,
        month: this.currentMonth,
        date: this.currentDate,
        isThisMonth: true
      })
      this.dateArray[todayIndex].isToday = true;
    }

    if (this.dateArray.length % 7 !== 0) {
      let nextMonthAdd = 7 - this.dateArray.length % 7
      for (let i = 0; i < nextMonthAdd; i++) {
        if (month === 11) {
          this.dateArray.push({
            year: year,
            month: 0,
            date: i + 1,
            isThisMonth: false,
            isToday: false,
            isSelect: false,
            isHighlighted: this.highlightDay(year, 0, i+1)
          })
        } else {
          this.dateArray.push({
            year: year,
            month: month + 1,
            date: i + 1,
            isThisMonth: false,
            isToday: false,
            isSelect: false,
            isHighlighted: this.highlightDay(year, month+1, i+1)
          })
        }
      }
    }

    for (let i = 0; i < this.dateArray.length / 7; i++) {
      for (let j = 0; j < 7; j++) {
        weekDays.push(this.dateArray[i * 7 + j]);
      }
      this.weekArray.push(weekDays);
      weekDays = [];
    }
  }

  back() {
    if (this.displayMonth === 0) {
      this.displayYear--;
      this.displayMonth = 11;
    } else {
      this.displayMonth--;
    }
    this.createMonth(this.displayYear, this.displayMonth);
  }

  forward() {
    if (this.displayMonth === 11) {
      this.displayYear++;
      this.displayMonth = 0;
    } else {
      this.displayMonth++;
    }
    this.createMonth(this.displayYear, this.displayMonth);
  }

  daySelect(day, i, j) {
    this.dateArray[this.lastSelect].isSelect = false;
    this.lastSelect = i * 7 + j;
    this.dateArray[i * 7 + j].isSelect = true;
    this.onDaySelect.emit(day);
  }

  highlightDay(checkingYear, checkingMonth, checkingDay): boolean {
    for(let i=0; i<this.days.length; i++) {
      if(checkingYear === this.days[i].date.getFullYear() &&
         checkingMonth == this.days[i].date.getMonth() &&
         checkingDay === this.days[i].date.getDate()) {
        return true;
      }
    }
    return false;
  }
}

interface dateObj {
  year: number,
  month: number,
  date: number,
  isThisMonth: boolean,
  isToday?: boolean,
  isSelect?: boolean,
  isHighlighted?: boolean
}
