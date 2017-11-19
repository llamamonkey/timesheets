import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Subscription} from "rxjs";
import * as firebase from "firebase";

@Injectable()
export class UserService {
  private user: firebase.User = null;
  private userSettings = [];
  private userSettingsSubscription:Subscription;

  constructor(private afDb: AngularFireDatabase) { }

  setUser(user){
    this.user = user;
    if (user != null){
      this.userSettingsSubscription = this.afDb.object('/users/'+this.user.uid).valueChanges().subscribe((data) => {
        this.userSettings = data;
      });
    } else {
      if (this.userSettingsSubscription){
          this.userSettingsSubscription.unsubscribe();
          this.userSettings = [];
      }
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
