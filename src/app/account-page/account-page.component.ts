import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {MatSnackBar} from "@angular/material";
import {UserService} from "../user.service";

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  private newEmail: string = '';
  private newEmailConfirm: string = '';

  private newPassword: string = '';
  private newPasswordConfirm: string = '';

  private userUid = null;

  private lunchDuration = 0;
  private user;

  constructor(private userService: UserService, private af: AngularFireDatabase, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.userUid = this.userService.getUid();
    this.user = this.userService.getUser();

    this.lunchDuration = this.userService.getSettings()['lunchDuration'];
  }

  saveAccountSettings(){
    this.af.object('/users/'+this.userUid).update({lunchDuration: this.lunchDuration});
  }

  sendVerification(){
    this.user.sendEmailVerification().then(() => {
      this.snackbar.open('A verification email has been sent', '')
    });
  }

  saveNewEmail(){
    if (this.newEmail == this.newEmailConfirm){
      this.user.updateEmail(this.newEmail).then(() => {
        this.snackbar.open('Your email address has been saved');
      }).catch((error) => {
        this.snackbar.open('There was an error saving your email: '+error);
      });
      this.newEmail = '';
      this.newEmailConfirm = '';
    }
  }

  saveNewPassword(){
    if (this.newPassword == this.newPasswordConfirm){
      this.user.updatePassword(this.newPassword).then(() => {
        this.snackbar.open('Your password has been saved');
      }).catch((error) => {
        this.snackbar.open('There was an error saving your password: '+error);
      });
      this.newPassword = '';
      this.newPasswordConfirm = '';
    }
  }

}
