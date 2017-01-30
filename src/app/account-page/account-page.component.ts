import { Component, OnInit } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {MdSnackBar} from "@angular/material";

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  private user: firebase.User = null;

  private newEmail: string = '';
  private newEmailConfirm: string = '';

  private newPassword: string = '';
  private newPasswordConfirm: string = '';

  constructor(private af: AngularFire, private snackbar: MdSnackBar) {
    this.af.auth.subscribe((auth) => {
      this.user = auth.auth;
    });
  }

  ngOnInit() {

  }

  sendVerification(){
    this.user.sendEmailVerification().then(() => {
      this.snackbar.open('A verification email has been sent', '', {
        duration: 6000
      })
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
