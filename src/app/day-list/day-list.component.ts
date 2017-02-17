import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable } from 'angularfire2';
import { MdDialog } from '@angular/material';
import { Subject } from 'rxjs/Subject'
import {DeleteDialogComponent} from "../dialogs/delete-dialog/delete-dialog.component";
import {AddDialogComponent} from "../dialogs/add-dialog/add-dialog.component";
import {EditDialogComponent} from "../dialogs/edit-dialog/edit-dialog.component";

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

  private user;

  constructor(private af: AngularFire, private dialog: MdDialog) {
    let currentYear = new Date().getFullYear();

    this.startDate = new Subject();
    this.endDate = new Subject();

    this.startDate.subscribe((val) => {
      this.startDateInput = val;
    });
    this.endDate.subscribe((val) => {
      this.endDateInput = val;
    });

    this.af.auth.subscribe((user) => {
      if (user){
        this.days = af.database.list('/time/'+user.uid, {
          query: {
            orderByKey: true,
            startAt: this.startDate.asObservable(),
            endAt: this.endDate.asObservable()
          }
        });
        this.user = user;
        setTimeout(() => {
          this.startDate.next(currentYear+'-01-01');
          this.endDate.next(currentYear+'-12-31');
        }, 100);
      }
    });



  }

  ngOnInit() {
  }

  addEntry(){
    let addDialogRef = this.dialog.open(AddDialogComponent);
    addDialogRef.afterClosed().subscribe(result => {
      if (result){
        let totalTime = (new Date(result.date+'T'+this.formatTime(result.endTime)).getTime() - new Date(result.date+'T'+this.formatTime(result.startTime)).getTime()) / (1000 * 3600);
        this.af.database.object('/time/'+this.user.uid+'/'+result.date).set({startTime: result.startTime, endTime: result.endTime, totalTime: totalTime.toFixed(1)});
      }
    });
  }

  editEntry(entry){
    let editDialogRef = this.dialog.open(EditDialogComponent);
    editDialogRef.componentInstance.dayEntry = entry;
    editDialogRef.afterClosed().subscribe(result => {
      if (result){
        let totalTime = (new Date(result.$key+'T'+this.formatTime(result.endTime)).getTime() - new Date(result.$key+'T'+this.formatTime(result.startTime)).getTime()) / (1000 * 3600);
        this.af.database.object('/time/'+this.user.uid+'/'+result.$key).update({startTime: result.startTime, endTime: result.endTime, totalTime: totalTime.toFixed(1)});
      }
    });
  }

  deleteEntry(entry){
    let deleteDialogRef = this.dialog.open(DeleteDialogComponent);
    deleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.af.database.object('/time/'+this.user.uid+'/'+entry.$key).remove();
      }
    });
  }

  formatTime(timeStr){
    let timeParts = timeStr.split(':');
    if (timeParts[0] < 10){
      return '0'+timeParts[0]+':'+timeParts[1];
    } else {
      return timeStr;
    }
  }
}
