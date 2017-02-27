import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

  public dayEntry = {date: '', startTime: '', endTime: '', lunchDuration: 0};

  constructor(public dialogRef: MdDialogRef<AddDialogComponent>) { }

  ngOnInit() {
  }

  confirmEntry(){
    this.dialogRef.close(this.dayEntry);
  }

}
