import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Injectable()
export class UserService {
  private user: firebase.User = null;

  constructor(private af: AngularFire) { }

  setUser(user){
    this.user = user;
  }

  getUser(){
    return this.user;
  }

  getUid(){
    return this.user ? this.user.uid : '';
  }

}
