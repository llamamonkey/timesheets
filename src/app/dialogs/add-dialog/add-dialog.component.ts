import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

  public dayEntry = {date: '', startTime: '', endTime: '', lunchDuration: 0, missed: 0, missReason: ''};

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>) { }

  ngOnInit() {
  }

  confirmEntry(){
    this.dialogRef.close(this.dayEntry);
  }

}
