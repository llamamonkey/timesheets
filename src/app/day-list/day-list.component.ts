import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable } from 'angularfire2';
import { MdDialog } from '@angular/material';
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {DeleteDialogComponent} from "../dialogs/delete-dialog/delete-dialog.component";
import {AddDialogComponent} from "../dialogs/add-dialog/add-dialog.component";
import {EditDialogComponent} from "../dialogs/edit-dialog/edit-dialog.component";
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import {ExcelService} from "../excel.service";

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.css']
})
export class DayListComponent implements OnInit {

  private days:FirebaseListObservable<any[]>;
  private daysVal;

  private startDate: BehaviorSubject<any>;
  private endDate: BehaviorSubject<any>;

  private startDateInput: string =  '';
  private endDateInput: string = '';

  constructor(private userService: UserService, private af: AngularFire, private dialog: MdDialog, private router: Router, private excel: ExcelService) {
    if (this.userService.getUser() == null){
      this.router.navigate(['/']);
    }

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth()+1;

    this.startDate = new BehaviorSubject(this.formatDate(currentYear+'-'+currentMonth+'-01'));
    this.endDate = new BehaviorSubject(this.formatDate(currentYear+'-'+currentMonth+'-'+this.getLastDay(currentYear, currentMonth)));

    this.startDate.subscribe((val) => {
      this.startDateInput = val;
    });
    this.endDate.subscribe((val) => {
      this.endDateInput = val;
    });

    this.days = af.database.list('/time/'+this.userService.getUid(), {
      query: {
        orderByKey: true,
        startAt: this.startDate.asObservable(),
        endAt: this.endDate.asObservable()
      }
    });

    this.days.subscribe((val) => {
      this.daysVal = val;
    });
  }

  ngOnInit() {
  }

  checkIn(){
    let currentTime = this.roundTime((this.getCurrentTime()));
    let currentDate = this.getCurrentDate();
    this.af.database.object('/time/'+this.userService.getUid()+'/'+currentDate).update({startTime: currentTime, missed: 0});

    this.generateHoursForDay(currentDate);
  }

  checkOut(){
    let currentTime = this.roundTime((this.getCurrentTime()));
    let currentDate = this.getCurrentDate();
    this.af.database.object('/time/'+this.userService.getUid()+'/'+currentDate).update({endTime: currentTime, missed: 0});

    this.generateHoursForDay(currentDate);
  }

  addEntry(){
    let addDialogRef = this.dialog.open(AddDialogComponent);
    addDialogRef.componentInstance.dayEntry.lunchDuration = this.userService.getSettings()['lunchDuration'];
    addDialogRef.afterClosed().subscribe(result => {
      if (result){
        let totalTime = this.generateHours(result.date, result.startTime ,result.endTime) - (result.lunchDuration ? result.lunchDuration : this.userService.getSettings()['lunchDuration']);
        let dataPath = '/time/'+this.userService.getUid()+'/'+result.date;
        this.af.database.object(dataPath).set({
          startTime: result.startTime,
          endTime: result.endTime,
          lunchDuration: result.lunchDuration,
          totalTime: totalTime.toFixed(1),
          missed: result.missed,
          missReason: result.missReason
        });
      }
    });
  }

  editEntry(entry){
    let editDialogRef = this.dialog.open(EditDialogComponent);
    editDialogRef.componentInstance.dayEntry = entry;
    editDialogRef.afterClosed().subscribe(result => {
      if (result){
        let totalTime = this.generateHours(result.$key, result.startTime ,result.endTime) - (result.lunchDuration ? result.lunchDuration : this.userService.getSettings()['lunchDuration']);
        this.af.database.object('/time/'+this.userService.getUid()+'/'+result.$key).update({
          startTime: result.startTime ? result.startTime : '',
          endTime: result.endTime ? result.endTime : '',
          lunchDuration: result.lunchDuration ? result.lunchDuration : this.userService.getSettings()['lunchDuration'],
          totalTime: totalTime.toFixed(1),
          missed: result.missed ? result.missed : 0,
          missReason: result.missReason
        });
      }
    });
  }

  deleteEntry(entry){
    let deleteDialogRef = this.dialog.open(DeleteDialogComponent);
    deleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.af.database.object('/time/'+this.userService.getUid()+'/'+entry.$key).remove();
      }
    });
  }

  downloadData(){
    this.excel.createExcelFromData(this.daysVal);
  }

  generateHours(date, startTime, endTime){
    if (date && startTime && endTime){
      return (new Date(date+'T'+this.formatTime(endTime)).getTime() - new Date(date+'T'+this.formatTime(startTime)).getTime()) / (1000 * 3600);
    } else {
      return null;
    }
  }

  generateHoursForDay(dayStr){
    let days = this.af.database.list('/time/'+this.userService.getUid()+'/'+dayStr).subscribe((data) => {
      var startTime = null;
      var endTime = null;
      var lunchDuration = null;

      data.forEach((entry) => {
        if (entry.$key == 'startTime'){
          startTime = entry.$value;
        }
        if (entry.$key == 'endTime'){
          endTime = entry.$value;
        }
        if (entry.$key == 'lunchDuration'){
          lunchDuration = entry.$value;
        }
      });
      if (startTime && endTime) {
        let hours = this.generateHours(dayStr, startTime, endTime) - (lunchDuration ? lunchDuration : this.userService.getSettings()['lunchDuration']);
        this.af.database.object('/time/' + this.userService.getUid() + '/' + dayStr).update({totalTime: hours.toFixed(1)});
      }
      days.unsubscribe();
    });
  }

  getCurrentDate(){
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return this.formatDate(date);
  }

  getCurrentTime(){
    let today = new Date();
    let time = today.getHours()+':'+today.getMinutes();
    return this.formatTime(time);
  }

  getLastDay(year, month){
    let d = new Date(year, month + 1, -1);
    return d.getDate();
  }

  formatDate(dateStr){
    if (!dateStr){
      return '';
    }
    let dateParts = dateStr.split('-');
    var formattedDate = dateParts[0];

    if (dateParts[1] < 10){
      formattedDate += '-0'+dateParts[1];
    } else {
      formattedDate += '-'+dateParts[1];
    }

    if (dateParts[2] < 10){
      formattedDate += '-0'+Number(dateParts[2]);
    } else {
      formattedDate += '-'+dateParts[2];
    }

    return formattedDate;
  }

  formatTime(timeStr){
    if (!timeStr){
      return '';
    }
    let timeParts = timeStr.split(':');
    let hours = Number(timeParts[0]) < 10 && timeParts[0] != '00' ? '0'+Number(timeParts[0]) : timeParts[0];
    let minutes = Number(timeParts[1]) < 10 && timeParts[1] != '00' ? '0'+Number(timeParts[1]) : timeParts[1];
    return hours+':'+minutes;
  }

  roundTime(timeStr){
    let timeParts = timeStr.split(':');
    let minutes = Math.round(timeParts[1]/5)*5;
    if (minutes >= 60){
      return this.formatTime((Number(timeParts[0])+1)+':'+(minutes-60));
    } else {
      return this.formatTime(timeParts[0]+':'+minutes);
    }
  }
}
