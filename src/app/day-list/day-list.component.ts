import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable } from 'angularfire2';
import { MdDialog } from '@angular/material';
import { Subject } from 'rxjs/Subject'
import {DeleteDialogComponent} from "../dialogs/delete-dialog/delete-dialog.component";
import {AddDialogComponent} from "../dialogs/add-dialog/add-dialog.component";
import {EditDialogComponent} from "../dialogs/edit-dialog/edit-dialog.component";
import {UserService} from "../user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.css']
})
export class DayListComponent implements OnInit {

  private days:FirebaseListObservable<any[]>;

  private startDate: Subject<any>;
  private endDate: Subject<any>;

  private startDateInput: string =  '';
  private endDateInput: string = '';

  constructor(private userService: UserService, private af: AngularFire, private dialog: MdDialog, private router: Router) {
    if (this.userService.getUser() == null){
      this.router.navigate(['/']);
    }

    let currentYear = new Date().getFullYear();

    this.startDate = new Subject();
    this.endDate = new Subject();

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
    setTimeout(() => {
      this.startDate.next(currentYear+'-01-01');
      this.endDate.next(currentYear+'-12-31');
    }, 100);
  }

  ngOnInit() {
  }

  checkIn(){
    let currentTime = this.roundTime((this.getCurrentTime()));
    let currentDate = this.getCurrentDate();
    this.af.database.object('/time/'+this.userService.getUid()+'/'+currentDate).update({startTime: currentTime});

    this.generateHoursForDay(currentDate);
  }

  checkOut(){
    let currentTime = this.roundTime((this.getCurrentTime()));
    let currentDate = this.getCurrentDate();
    this.af.database.object('/time/'+this.userService.getUid()+'/'+currentDate).update({endTime: currentTime});

    this.generateHoursForDay(currentDate);
  }

  addEntry(){
    let addDialogRef = this.dialog.open(AddDialogComponent);
    addDialogRef.afterClosed().subscribe(result => {
      if (result){
        let totalTime = this.generateHours(result.date, result.startTime ,result.endTime);
        this.af.database.object('/time/'+this.userService.getUid()+'/'+result.date).set({startTime: result.startTime, endTime: result.endTime, totalTime: totalTime.toFixed(1)});
      }
    });
  }

  editEntry(entry){
    let editDialogRef = this.dialog.open(EditDialogComponent);
    editDialogRef.componentInstance.dayEntry = entry;
    editDialogRef.afterClosed().subscribe(result => {
      if (result){
        let totalTime = this.generateHours(result.$key, result.startTime ,result.endTime);
        this.af.database.object('/time/'+this.userService.getUid()+'/'+result.$key).update({startTime: result.startTime, endTime: result.endTime, totalTime: totalTime.toFixed(1)});
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

  generateHours(date, startTime, endTime){
    return (new Date(date+'T'+this.formatTime(endTime)).getTime() - new Date(date+'T'+this.formatTime(startTime)).getTime()) / (1000 * 3600)
  }

  generateHoursForDay(dayStr){
    let days = this.af.database.list('/time/'+this.userService.getUid()+'/'+dayStr).subscribe((data) => {
      var startTime = null;
      var endTime = null;

      data.forEach((entry) => {
        if (entry.$key == 'startTime'){
          startTime = entry.$value;
        }
        if (entry.$key == 'endTime'){
          endTime = entry.$value;
        }
      });
      if (startTime && endTime) {
        let hours = this.generateHours(dayStr, startTime, endTime);
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

  formatDate(dateStr){
    let dateParts = dateStr.split('-');
    var formattedDate = dateParts[0];

    if (dateParts[1] < 10){
      formattedDate += '-0'+dateParts[1];
    } else {
      formattedDate += '-'+dateParts[1];
    }

    if (dateParts[2] < 10){
      formattedDate += '-0'+dateParts[2];
    } else {
      formattedDate += '-'+dateParts[2];
    }

    return formattedDate;
  }

  formatTime(timeStr){
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
