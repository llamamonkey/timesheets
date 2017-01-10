import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

  private dayEntry = {date: '', startTime: '', endTime: ''};

  constructor(public dialogRef: MdDialogRef<AddDialogComponent>) { }

  ngOnInit() {
  }

  confirmEntry(){
    this.dialogRef.close(this.dayEntry);
  }

}
