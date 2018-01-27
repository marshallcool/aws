import { Injectable, Inject } from '@angular/core';

import { environment } from '../../environments/environment';


declare var AWSCognito: any;
declare var AWS: any;

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
  callback(): void;
  callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {

  public static _REGION = environment.region;

  public static _IDENTITY_POOL_ID = environment.identityPoolId;
  public static _USER_POOL_ID = environment.userPoolId;
  public static _CLIENT_ID = environment.clientId;

  public static _POOL_DATA = {
    UserPoolId: CognitoUtil._USER_POOL_ID,
    ClientId: CognitoUtil._CLIENT_ID
  };


  public static getAwsCognito(): any {
    return AWSCognito;
  }

  getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(CognitoUtil._POOL_DATA);
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }


  getCognitoIdentity(): string {
    return AWS.config.credentials.identityId;
  }
}

@Injectable()
export class UserRegistrationService {

  constructor( @Inject(CognitoUtil) public cognitoUtil: CognitoUtil) {

  }

  register(user: any, callback: CognitoCallback): void {

    let attributeList = [];

    attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
      Name: 'phone_number',
      Value: user.phone
    }));

    attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
      Name: 'email',
      Value: ''
    }));

    this.cognitoUtil.getUserPool().signUp(user.phone, user.password, attributeList, null, function (err, result) {
      if (err) {
        callback.cognitoCallback(err.message, null);
      } else {
        console.log('UserRegistrationService: registered user is ' + result);
        callback.cognitoCallback(null, result);
      }
    });

  }

}

