import { Injectable } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Subscription} from "rxjs";

@Injectable()
export class UserService {
  private user: firebase.User = null;
  private userSettings = [];
  private userSettingsSubscription:Subscription;

  constructor(private af: AngularFire) { }

  setUser(user){
    this.user = user;
    if (user != null){
      this.userSettingsSubscription = this.af.database.list('/users/'+this.user.uid).subscribe((data) => {
        this.userSettings = [];
        data.forEach((entry) => {
          if (entry.$key == 'lunchDuration'){
            this.userSettings[entry.$key] = entry.$value;
          }
        });
      });
    } else {
      this.userSettingsSubscription.unsubscribe();
      this.userSettings = [];
    }
  }

  getUser(){
    return this.user;
  }

  getUid(){
    return this.user ? this.user.uid : '';
  }

  getSettings(){
    return this.userSettings;
  }

}
