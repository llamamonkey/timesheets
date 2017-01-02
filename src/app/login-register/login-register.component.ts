import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  private user = {email: '', password: ''};
  private newUser = {name: '', email: '', confirmEmail: '', password: '', confirmPassword: ''};

  constructor(private af: AngularFire) { }

  ngOnInit() {
  }

  logIn(){
  }

  register(){
  }

}
