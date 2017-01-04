import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnDestroy {

  private user = {email: '', password: ''};
  private newUser = {name: '', email: '', confirmEmail: '', password: '', confirmPassword: ''};

  private currentUser;

  private isLoading:Boolean = false;

  constructor(private af: AngularFire, private snackbar: MdSnackBar, private router: Router) {
    this.af.auth.subscribe((user) => {
      if (user){
        this.currentUser = user.auth;
      } else {
        this.currentUser = null;
      }
    })
  }

  ngOnDestroy() {
    this.af.auth.unsubscribe();
  }

  logIn(){
    this.isLoading = true;
    this.af.auth.login({email: this.user.email, password: this.user.password}).then((data) => {
      this.isLoading = false;
      console.log(data);
      this.router.navigate(['']);
    }).catch((error) => {
      this.isLoading = false;
      if (error['code'] == 'auth/user-not-found'){
        this.snackbar.open('Login Failed - The username and password combination could not be found', '', {
          duration: 6000
        });
      } else {
        this.snackbar.open('Login Failed - ' + error['code'], '', {
          duration: 6000
        });
      }
    });
  }

  register(){
    if (this.newUser.email == this.newUser.confirmEmail){
      if (this.newUser.password == this.newUser.confirmPassword){
        this.af.auth.createUser({email: this.newUser.email, password: this.newUser.password}).then((data) => {
          this.currentUser.updateProfile({displayName: this.newUser.name, photoURL: ''}).then(() => {
            this.currentUser.sendEmailVerification();
            this.router.navigate(['']);
          })
        }).catch((error) => {
          console.log(error);
        });
      } else {
        //Passwords don't match
        this.snackbar.open('Registration Failed - Your passwords did not match', '', {
          duration: 6000
        });
      }
    } else {
      //emails don't match
      this.snackbar.open('Registration Failed - Your emails did not match', '', {
        duration: 6000
      });
    }
  }

}
