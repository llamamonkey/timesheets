import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-filename-dialog',
  templateUrl: './filename-dialog.component.html',
  styleUrls: ['./filename-dialog.component.css']
})
export class FilenameDialogComponent implements OnInit {

  public filename: string = '';

  constructor(public dialogRef: MatDialogRef<FilenameDialogComponent>) { }

  ngOnInit() {
  }

  confirmFilename(){
    this.dialogRef.close(this.filename);
  }

}
