import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './services/api.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform, private splashScreen: SplashScreen,
    private statusBar: StatusBar, private apiService: ApiService,
    private navCtrl: NavController,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.apiService.getUser().subscribe(data => {
        if (!data) {
          // this.navCtrl.navigateRoot(['tabs/tab-about']);
          return;
        }
        // this.apiService.validateAuthToken(data.token).subscribe(res => {
        //   this.navCtrl.navigateRoot(['tabs/tab-about']);
        // }, token_e => {
        //   this.navCtrl.navigateRoot(['tabs/tab-about']);
        // })
      }, e => {
        this.navCtrl.navigateRoot(['tabs/tab-about']);
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  
}
