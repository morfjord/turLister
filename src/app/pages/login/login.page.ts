import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isRememberMe: boolean = false;
  constructor(
    private navCtrl: NavController, private fb: Facebook, private apiService: ApiService, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private storage: Storage
  ) {
    this.loginForm = this.getLoginFormGroup();
  }

  ngOnInit() {
  }
  getLoginFormGroup() {
    return new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  loginWithFacebook() {
    this.fb.login(['email', 'public_profile']).then((res: FacebookLoginResponse) => {
      if (res.status === 'connected') {
        // get User Info from fb id
        this.getUserDetailFromFB(res.authResponse.userID);
      } else {
        alert("Facebook Logget inn, men statusen er ikke tilkoblet");
      }
    }).catch(e => {
      alert("Facebook-pålogging mislyktes" + JSON.stringify(e));
    })
  }
  loginWithInstagram() {

  }
  onLoginSubmit() {
    this.apiService.doLoginInWordpress(this.loginForm.value.email, this.loginForm.value.password).subscribe(async res => {
      this.storage.set(this.apiService.IS_FACEBOOK_LOGIN, false);
      this.navCtrl.navigateRoot(['tabs/tab-mytours']);
      const toast = await this.toastCtrl.create({
        message: 'Du er logget på.',
        duration: 3000
      });
      toast.present();
    }, e => {
      this.showError(e);
    })
  }
  getUserDetailFromFB(userId) {
    this.fb.api('/' + userId + '/?fields=id,email,name,picture', ['public_profile'])
      .then(async res => {
        let userdata = {
          email: res['email'],
          name: res['name'],
          picture: res['picture']['data']['url']
        }
        // first, check whether specific email exist or not in db, 
        let newUSer = {
          uName: res['name'],
          email: res['email'],
          password: '123456',
          fName: res['first_name'],
          lName: res['last_name']
        }

        this.apiService.doSignupInWordpress(newUSer).subscribe(async res => {
          this.storage.set(this.apiService.JWT_KEY, userdata);
          this.storage.set(this.apiService.IS_FACEBOOK_LOGIN, true);
          this.apiService.user.next(userdata);
          this.navCtrl.navigateRoot(['tabs/tab-mytours']);
          const toast = await this.toastCtrl.create({
            message: 'Du er logget på.',
            duration: 3000
          });
          toast.present();
        }, async err => {
          this.storage.set(this.apiService.JWT_KEY, userdata);
          this.storage.set(this.apiService.IS_FACEBOOK_LOGIN, true);
          this.apiService.user.next(userdata);
          this.navCtrl.navigateRoot(['tabs/tab-mytours']);
          // const toast = await this.toastCtrl.create({
          //   message: 'Du er logget på.' + JSON.stringify(err),
          //   duration: 3000
          // });
          // toast.present();
          // this.showError(err);
        })
      })
      .catch(e => {
        console.log(e);
      });
  }
  goForgotPassword() {
    this.navCtrl.navigateForward(['/forgot-password'])
  }
  goSignupPage() {
    this.navCtrl.navigateForward(['/signup'])
  }
  goTermsConditions() {
    this.navCtrl.navigateForward(['/terms-conditions'])
  }

  async showError(err) {
    console.error("error login:", err);
    const alert = await this.alertCtrl.create({
      header: err.error.code,
      subHeader: err.error.data.status,
      message: err.error.message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
