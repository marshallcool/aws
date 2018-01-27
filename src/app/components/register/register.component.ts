import { Component, OnInit } from '@angular/core';

import { UserRegistrationService, CognitoCallback } from '../../services/cognito.service';

import { MatSnackBar } from '@angular/material';

export class RegistrationUser {
  phone: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, CognitoCallback {
  registrationUser: RegistrationUser;

  constructor(public userRegistration: UserRegistrationService,
              private snackBar: MatSnackBar) {
    this.onInit();
  }

  ngOnInit() {
  }

  onInit() {
    this.registrationUser = new RegistrationUser();
  }

  onRegister() {
    this.registrationUser.phone = '+7' + this.registrationUser.phone;
    this.userRegistration.register(this.registrationUser, this);
    this.registrationUser.phone = '';
    this.registrationUser.password = '';
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) {
      this.snackBar.open(message, '', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        extraClasses: [ 'warning-bar' ],
        duration: 3000,
      });
    } else {
      this.snackBar.open('Аккаунт зарегистрирован', '', {
        verticalPosition: 'top',
        horizontalPosition: 'right',
        extraClasses: [ 'success-bar' ],
        duration: 3000,
      });
    }
  }

}
