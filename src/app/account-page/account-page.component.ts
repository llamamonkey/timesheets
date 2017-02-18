import { Component, OnInit } from '@angular/core';
import {AngularFire} from 'angularfire2';
import {MdSnackBar} from "@angular/material";
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

  constructor(private userService: UserService, private af: AngularFire, private snackbar: MdSnackBar) { }

  ngOnInit() {

  }

  sendVerification(){
    this.userService.getUser().sendEmailVerification().then(() => {
      this.snackbar.open('A verification email has been sent', '', {
        duration: 6000
      })
    });
  }

  saveNewEmail(){
    if (this.newEmail == this.newEmailConfirm){
      this.userService.getUser().updateEmail(this.newEmail).then(() => {
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
      this.userService.getUser().updatePassword(this.newPassword).then(() => {
        this.snackbar.open('Your password has been saved');
      }).catch((error) => {
        this.snackbar.open('There was an error saving your password: '+error);
      });
      this.newPassword = '';
      this.newPasswordConfirm = '';
    }
  }

}
