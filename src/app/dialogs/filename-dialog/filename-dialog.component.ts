import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-filename-dialog',
  templateUrl: './filename-dialog.component.html',
  styleUrls: ['./filename-dialog.component.css']
})
export class FilenameDialogComponent implements OnInit {

  public filename: string = '';

  constructor(public dialogRef: MdDialogRef<FilenameDialogComponent>) { }

  ngOnInit() {
  }

  confirmFilename(){
    this.dialogRef.close(this.filename);
  }

}
