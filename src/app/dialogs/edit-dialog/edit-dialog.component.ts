import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  public dayEntry;

  constructor(public dialogRef: MdDialogRef<EditDialogComponent>) { }

  ngOnInit() {
    if (!this.dayEntry.missed){
      this.dayEntry.missed = 0;
    }
    if (!this.dayEntry.missReason){
      this.dayEntry.missReason = '';
    }
  }

  confirmEntry(){
    this.dialogRef.close(this.dayEntry);
  }

}
