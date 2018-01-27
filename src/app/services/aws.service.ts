import { Injectable } from '@angular/core';
import { CognitoUtil, Callback } from './cognito.service';

declare var AWS: any;
declare var AMA: any;

@Injectable()
export class AwsUtil {
  public static firstLogin: boolean = false;
  public static runningInit: boolean = false;

  constructor() {
    AWS.config.region = CognitoUtil._REGION;
  }

  initAwsService(callback: Callback, isLoggedIn: boolean, idToken: string) {

    if (AwsUtil.runningInit) {
      console.log('AwsUtil: Aborting running initAwsService()...its running already.');
      if (callback != null) {
        callback.callback();
        callback.callbackWithParam(null);
      }
      return;
    }


    console.log('AwsUtil: Running initAwsService()');
    AwsUtil.runningInit = true;


    let mythis = this;
    if (isLoggedIn) {
      mythis.setupAWS(isLoggedIn, callback, idToken);
    }

  }


  /**
   * Sets up the AWS global params
   *
   * @param isLoggedIn
   * @param callback
   */
  setupAWS(isLoggedIn: boolean, callback: Callback, idToken: string): void {
    console.log('AwsUtil: in setupAWS()');
    if (isLoggedIn) {
      console.log('AwsUtil: User is logged in');
      // Setup mobile analytics
      var options = {
        appId: '32673c035a0b40e99d6e1f327be0cb60',
        appTitle: 'aws-cognito-angular2-quickstart'
      };

      var mobileAnalyticsClient = new AMA.Manager(options);
      mobileAnalyticsClient.submitEvents();

      this.addCognitoCredentials(idToken);

      console.log('AwsUtil: Retrieving the id token');

    } else {
      console.log('AwsUtil: User is not logged in');
    }

    if (callback != null) {
      callback.callback();
      callback.callbackWithParam(null);
    }

    AwsUtil.runningInit = false;
  }

  addCognitoCredentials(idTokenJwt: string): void {
    let params = AwsUtil.getCognitoParametersForIdConsolidation(idTokenJwt);

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

    AWS.config.credentials.get(function (err) {
      if (!err) {
        if (AwsUtil.firstLogin) {
          this.ddb.writeLogEntry('login');
          AwsUtil.firstLogin = false;
        }
      }
    });
  }

  static getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
    console.log('AwsUtil: enter getCognitoParametersForIdConsolidation()');
    let url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;
    let logins: Array<string> = [];
    logins[url] = idTokenJwt;
    let params = {
      IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID, /* required */
      Logins: logins
    };

    return params;
  }

}
