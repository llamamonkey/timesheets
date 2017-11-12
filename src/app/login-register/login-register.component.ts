import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';

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

  constructor(private afAuth: AngularFireAuth, private snackbar: MatSnackBar) {
    this.afAuth.authState.subscribe((user) => {
      if (user){
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    })
  }

  ngOnDestroy() {
    //this.af.auth.unsubscribe();
  }

  logIn(){
    this.isLoading = true;
    this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password).then((data) => {
      this.isLoading = false;
    }).catch((error) => {
      this.isLoading = false;
      if (error['code'] == 'auth/user-not-found'){
        this.snackbar.open('Login Failed - The username and password combination could not be found', '');
      } else {
        this.snackbar.open('Login Failed - ' + error['code'], '');
      }
    });
  }

  register(){
    this.isLoading = true;
    if (this.newUser.email == this.newUser.confirmEmail){
      if (this.newUser.password == this.newUser.confirmPassword){
        this.afAuth.auth.createUserWithEmailAndPassword(this.newUser.email,this.newUser.password).then((data) => {
          this.currentUser.updateProfile({displayName: this.newUser.name, photoURL: ''}).then(() => {
            this.isLoading = false;
            this.currentUser.sendEmailVerification();
          })
        }).catch((error) => {
          console.log(error);
        });
      } else {
        //Passwords don't match
        this.isLoading = false;
        this.snackbar.open('Registration Failed - Your passwords did not match', '');
      }
    } else {
      //emails don't match
      this.isLoading = false;
      this.snackbar.open('Registration Failed - Your emails did not match', '');
    }
  }

}
