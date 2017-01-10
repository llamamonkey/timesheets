import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { MdDialog } from '@angular/material';
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
  private user;

  constructor(private af: AngularFire, private dialog: MdDialog) {
    this.af.auth.subscribe((user) => {
      if (user){
        this.days = this.af.database.list('/time/'+user.uid);
        this.user = user;
      }
    })
  }

  ngOnInit() {
  }

  addEntry(){
    let addDialogRef = this.dialog.open(AddDialogComponent);
    addDialogRef.afterClosed().subscribe(result => {
      this.af.database.object('/time/'+this.user.uid+'/'+result.date).set({startTime: result.startTime, endTime: result.endTime});
    });
  }

  editEntry(entry){
    let editDialogRef = this.dialog.open(EditDialogComponent);
    editDialogRef.componentInstance.dayEntry = entry;
    editDialogRef.afterClosed().subscribe(result => {
      this.af.database.object('/time/'+this.user.uid+'/'+result.$key).update({startTime: result.startTime, endTime: result.endTime});
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

}
