import { Component, ViewChild } from '@angular/core';
// import { NavController } from 'ionic-angular';
import { AuthService } from '../../app/auth.service';
import { MyApp } from '../../app/app.component';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // @ViewChild('email') email: any;
  private email: string;
  private password: string;

  constructor(
    // private navCtrl: NavController,
    private authService: AuthService
  ) {
  }

  signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';
  }

  login() {
    this.authService.login(this.email, this.password)
    .then(_ => {
      console.log(this.authService.userObj);
      // MyApp.prototype.rootPage = TabsPage;
    })
    .catch(err => alert(err));
    this.email = this.password = '';
  }

  ionViewDidLoad(): void {
    setTimeout(() => {
      // this.email.setFocus();
    }, 500);
  }
}
