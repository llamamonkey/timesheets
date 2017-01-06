import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.css']
})
export class DayListComponent implements OnInit {

  private days:FirebaseListObservable<any[]>;

  constructor(private af: AngularFire, private dialog: MdDialog) {
    this.af.auth.subscribe((user) => {
      if (user){
        this.days = this.af.database.list('/time/'+user.uid);
      }
    })
  }

  ngOnInit() {
  }

}
