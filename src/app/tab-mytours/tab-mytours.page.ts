import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { KeysPipe, ValuesPipe } from 'ngx-pipes'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab-mytours',
  templateUrl: './tab-mytours.page.html',
  styleUrls: ['./tab-mytours.page.scss'],
  providers: [KeysPipe, ValuesPipe]
})
export class TabMytoursPage implements OnInit, OnDestroy {
  user = this.apiService.getUser();
  currentUser: any;
  profileOfRegisteredTours: any;
  places: any[] = [];
  isFirstLoaded: boolean = true;
  isViewChild: number = 0;

  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private navCtrl: NavController, private apiService: ApiService, private keysPipe: KeysPipe,
    private valuesPipe: ValuesPipe, private fb: Facebook, private storage: Storage
  ) {
    this.user
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(currentUser => {
        this.isFirstLoaded = true;
        this.currentUser = currentUser;
        if (!this.currentUser) {
          this.places = [];
          this.profileOfRegisteredTours = null;
        } else {
          console.log("called constructor");
          this.isFirstLoaded = false;
          this.isViewChild = 0;
          this.getProfileOfRegisterdTours();
        }
      })
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    console.log("called destroyed");
    this.isFirstLoaded = false;
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ionViewWillEnter() {
    console.log("ion view called");
    if (this.isViewChild === 0) {
      this.isViewChild = 1;
      return;
    }
    this.places = [];
    if (this.currentUser) {
      this.getProfileOfRegisterdTours();
    } else {
      this.profileOfRegisteredTours = null;
    }
  }
  getProfileOfRegisterdTours() {
    this.apiService.getProfileOfRegisterdTours(this.currentUser.email).subscribe(res => {
      this.profileOfRegisteredTours = res;
      if (this.profileOfRegisteredTours.places) {
        let origin_places = this.profileOfRegisteredTours.places;
        this.places = this.valuesPipe.transform(origin_places)

        // this.keysPipe.transform(this.places);
        console.log(">>>>>>>>>>>>>res:", this.places);
      }
    }, err => {
      console.error("get profile error:", err);

    });
  }
  goSignupPage() {
    this.navCtrl.navigateForward(['/signup']);
  }
  goLoginPage() {
    this.navCtrl.navigateForward(['/login']);
  }
  doLogout() {
    this.storage.get(this.apiService.IS_FACEBOOK_LOGIN).then(flag => {
      if (flag) {
        this.fb.logout().then(res => {
          this.apiService.logout();
        }).catch(err => {
          alert("error facebook logout:" + JSON.stringify(err));
        });
      } else {
        this.apiService.logout();
      }
    }).catch(err => {

    });
  }
  goTourDetails(id) {
    if (!id) {
      return;
    }
    this.navCtrl.navigateForward(['tabs/tab-map/tour-detail'], { queryParams: { tourid: id } });
  }
}
